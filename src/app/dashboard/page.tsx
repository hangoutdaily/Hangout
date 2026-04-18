'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  adminLogin,
  adminTokenKey,
  AdminUserRow,
  AdminHangoutRow,
  getAdminSession,
  getAdminUsers,
  getAdminHangouts,
  updateAdminUserStatus,
  updateAdminHangoutStatus,
} from '@/api/admin';
import { ApiError } from '@/types';

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function DashboardPage() {
  const [authChecking, setAuthChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [hangouts, setHangouts] = useState<AdminHangoutRow[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [updatingHangoutId, setUpdatingHangoutId] = useState<number | null>(null);

  async function loadDashboardData() {
    setLoadingData(true);
    setDashboardError(null);
    try {
      const [usersRes, hangoutsRes] = await Promise.all([getAdminUsers(), getAdminHangouts()]);
      setUsers(usersRes.data.users || []);
      setHangouts(hangoutsRes.data.hangouts || []);
    } catch (err) {
      const error = err as ApiError;
      setDashboardError(error.response?.data?.error || 'Failed to load dashboard data.');
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    async function init() {
      const token = sessionStorage.getItem(adminTokenKey);
      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const res = await getAdminSession();
        setAdminEmail(res.data.admin?.email || null);
        await loadDashboardData();
      } catch {
        sessionStorage.removeItem(adminTokenKey);
        setAdminEmail(null);
      } finally {
        setAuthChecking(false);
      }
    }

    init();
  }, []);

  const stats = useMemo(() => {
    const activeUsers = users.filter((u) => u.active).length;
    const pendingUsers = users.length - activeUsers;
    const activeHangouts = hangouts.filter((h) => h.isOpen).length;
    const hiddenHangouts = hangouts.length - activeHangouts;

    return { activeUsers, pendingUsers, activeHangouts, hiddenHangouts };
  }, [users, hangouts]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await adminLogin({
        email: loginEmail,
        password: loginPassword,
      });

      sessionStorage.setItem(adminTokenKey, res.data.token);
      setAdminEmail(res.data.admin?.email || loginEmail.toLowerCase());
      setLoginPassword('');
      await loadDashboardData();
    } catch (err) {
      const error = err as ApiError;
      setLoginError(error.response?.data?.error || 'Invalid admin credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(adminTokenKey);
    setAdminEmail(null);
    setUsers([]);
    setHangouts([]);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError(null);
  }

  async function handleToggleUser(user: AdminUserRow) {
    setUpdatingUserId(user.id);
    setDashboardError(null);
    try {
      const nextActive = !user.active;
      await updateAdminUserStatus(user.id, nextActive);
      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, active: nextActive } : item))
      );
    } catch (err) {
      const error = err as ApiError;
      setDashboardError(error.response?.data?.error || 'Failed to update user status.');
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleToggleHangout(hangout: AdminHangoutRow) {
    setUpdatingHangoutId(hangout.id);
    setDashboardError(null);
    try {
      const nextIsOpen = !hangout.isOpen;
      await updateAdminHangoutStatus(hangout.id, nextIsOpen);
      setHangouts((prev) =>
        prev.map((item) => (item.id === hangout.id ? { ...item, isOpen: nextIsOpen } : item))
      );
    } catch (err) {
      const error = err as ApiError;
      setDashboardError(error.response?.data?.error || 'Failed to update hangout status.');
    } finally {
      setUpdatingHangoutId(null);
    }
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center p-4">
        <p className="text-sm">Checking admin session...</p>
      </div>
    );
  }

  if (!adminEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-slate-200 mt-2">
            Sign in with admin credentials to manage users and hangouts.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="adminEmail" className="text-sm block mb-1">
                Email
              </label>
              <input
                id="adminEmail"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-lg bg-white/90 text-slate-900 border border-transparent focus:border-slate-500 focus:outline-none"
                placeholder="hangoutdailyapp@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="adminPassword" className="text-sm block mb-1">
                Password
              </label>
              <input
                id="adminPassword"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-lg bg-white/90 text-slate-900 border border-transparent focus:border-slate-500 focus:outline-none"
                placeholder="••••••••••"
              />
            </div>

            {loginError && <p className="text-sm text-rose-300">{loginError}</p>}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors disabled:opacity-60"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Hangout Admin</p>
              <h1 className="text-2xl sm:text-3xl font-semibold">Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Signed in as {adminEmail}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="h-10 px-4 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Users" value={stats.activeUsers} />
          <StatCard label="Pending Users" value={stats.pendingUsers} />
          <StatCard label="Active Hangouts" value={stats.activeHangouts} />
          <StatCard label="Hidden Hangouts" value={stats.hiddenHangouts} />
        </section>

        {dashboardError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
            {dashboardError}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="text-sm text-slate-600">
              Approve new profiles and deactivate users when required.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Contact</th>
                  <th className="text-left px-4 py-3 font-medium">City</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingData && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                )}

                {!loadingData && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}

                {users.map((user) => {
                  const name = user.profile?.name || 'Profile pending';
                  const city = user.profile?.city || '-';
                  const contact = user.email || user.phone || '-';

                  return (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-800">{name}</td>
                      <td className="px-4 py-3 text-slate-600">{contact}</td>
                      <td className="px-4 py-3 text-slate-600">{city}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            user.active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {user.active ? 'Approved' : 'Under review'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {user.profile?.displayId ? (
                            <Link
                              href={`/profile/${user.profile.displayId}`}
                              target="_blank"
                              className="h-8 px-3 rounded-md border border-slate-300 inline-flex items-center text-xs font-medium hover:bg-slate-100"
                            >
                              View Profile
                            </Link>
                          ) : (
                            <span className="h-8 px-3 rounded-md border border-slate-200 inline-flex items-center text-xs text-slate-400">
                              No profile
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleToggleUser(user)}
                            disabled={updatingUserId === user.id}
                            className={`h-8 px-3 rounded-md text-xs font-semibold ${
                              user.active
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            } disabled:opacity-60`}
                          >
                            {updatingUserId === user.id
                              ? 'Saving...'
                              : user.active
                                ? 'Deactivate'
                                : 'Approve'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold">Hangouts</h2>
            <p className="text-sm text-slate-600">
              Mark hangouts active or inactive to moderate sensitive content.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Host</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Attendees</th>
                  <th className="text-left px-4 py-3 font-medium">Visibility</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingData && hangouts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      Loading hangouts...
                    </td>
                  </tr>
                )}

                {!loadingData && hangouts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      No hangouts found.
                    </td>
                  </tr>
                )}

                {hangouts.map((hangout) => (
                  <tr key={hangout.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{hangout.title}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {hangout.host?.name || 'Unknown host'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(hangout.datetime)}</td>
                    <td className="px-4 py-3 text-slate-600">{hangout._count.attendees}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          hangout.isOpen
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {hangout.isOpen ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleHangout(hangout)}
                        disabled={updatingHangoutId === hangout.id}
                        className={`h-8 px-3 rounded-md text-xs font-semibold border ${
                          hangout.isOpen
                            ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        } disabled:opacity-60`}
                      >
                        {updatingHangoutId === hangout.id
                          ? 'Saving...'
                          : hangout.isOpen
                            ? 'Mark Inactive'
                            : 'Mark Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
