'use client';

import { useState, useEffect } from 'react';
import { Plan } from '@prisma/client';

interface User {
    id: string;
    name: string;
    email: string;
    plan: Plan;
    createdAt: string;
    _count: {
        jobs: number;
        apiKeys: number;
    };
}

interface Stats {
    totalUsers: number;
    totalJobs: number;
    totalApiKeys: number;
    totalExecutions: number;
    planDistribution: {
        FREE: number;
        HOBBY: number;
        PRO: number;
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [newPlan, setNewPlan] = useState<Plan>('FREE');
    const [simulationResult, setSimulationResult] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/admin/users'),
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData.data);
            }

            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setUsers(usersData.data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSimulateChange = async (userId: string, plan: Plan) => {
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/plan?userId=${userId}&plan=${plan}`);
            if (res.ok) {
                const data = await res.json();
                setSimulationResult(data.data);
            }
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleChangePlan = async (userId: string, plan: Plan) => {
        if (!confirm(`このユーザーのプランを ${plan} に変更しますか?`)) {
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, plan }),
            });

            if (res.ok) {
                alert('プランを変更しました');
                setSimulationResult(null);
                await loadData();
            } else {
                const error = await res.json();
                alert(`エラー: ${error.message}`);
            }
        } catch (error) {
            console.error('Plan change failed:', error);
            alert('プラン変更に失敗しました');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-gray-400">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-white/10">
                <div className="px-8 py-6">
                    <h1 className="text-3xl font-bold mb-2">🔧 管理者パネル</h1>
                    <p className="text-gray-400">システム統計とユーザー管理</p>
                </div>
            </div>

            <div className="px-8 py-6 space-y-8">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                            <p className="text-sm text-gray-400 mb-2">総ユーザー数</p>
                            <p className="text-3xl font-bold">{stats.totalUsers}</p>
                        </div>
                        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                            <p className="text-sm text-gray-400 mb-2">総ジョブ数</p>
                            <p className="text-3xl font-bold">{stats.totalJobs}</p>
                        </div>
                        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                            <p className="text-sm text-gray-400 mb-2">総APIキー数</p>
                            <p className="text-3xl font-bold">{stats.totalApiKeys}</p>
                        </div>
                        <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                            <p className="text-sm text-gray-400 mb-2">総実行回数</p>
                            <p className="text-3xl font-bold">{stats.totalExecutions}</p>
                        </div>
                    </div>
                )}

                {/* Plan Distribution */}
                {stats && (
                    <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                        <h2 className="text-xl font-bold mb-4">プラン分布</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-400">{stats.planDistribution.FREE}</p>
                                <p className="text-sm text-gray-400">FREE</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-400">{stats.planDistribution.HOBBY}</p>
                                <p className="text-sm text-gray-400">HOBBY</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-400">{stats.planDistribution.PRO}</p>
                                <p className="text-sm text-gray-400">PRO</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <div className="border border-white/10 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold">ユーザー一覧</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">ユーザー</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">プラン</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">ジョブ</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">APIキー</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">登録日</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-400">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                user.plan === 'FREE' ? 'bg-green-500/20 text-green-400' :
                                                user.plan === 'HOBBY' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{user._count.jobs}</td>
                                        <td className="px-6 py-4">{user._count.apiKeys}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedUser(user.id)}
                                                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-sm"
                                                disabled={actionLoading}
                                            >
                                                プラン変更
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Plan Change Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="bg-gray-900 border border-white/10 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4">プラン変更</h3>
                            
                            {(() => {
                                const user = users.find(u => u.id === selectedUser);
                                return user ? (
                                    <div className="mb-6">
                                        <p className="text-gray-400">ユーザー: <span className="text-white">{user.name}</span></p>
                                        <p className="text-gray-400">現在のプラン: <span className="text-white">{user.plan}</span></p>
                                    </div>
                                ) : null;
                            })()}

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">新しいプラン</label>
                                <select
                                    value={newPlan}
                                    onChange={(e) => setNewPlan(e.target.value as Plan)}
                                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                                >
                                    <option value="FREE">FREE</option>
                                    <option value="HOBBY">HOBBY</option>
                                    <option value="PRO">PRO</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={() => handleSimulateChange(selectedUser, newPlan)}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {actionLoading ? '処理中...' : 'シミュレーション'}
                                </button>
                                <button
                                    onClick={() => handleChangePlan(selectedUser, newPlan)}
                                    disabled={actionLoading || !simulationResult}
                                    className="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {actionLoading ? '処理中...' : '変更実行'}
                                </button>
                            </div>

                            {simulationResult && (
                                <div className="mb-4 p-4 bg-black/50 rounded border border-white/10">
                                    <h4 className="font-semibold mb-2">シミュレーション結果</h4>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="text-gray-400">変更:</span>{' '}
                                            <span className="font-medium">{simulationResult.oldPlan} → {simulationResult.newPlan}</span>
                                        </p>
                                        {simulationResult.changesRequired && (
                                            <>
                                                <p className="text-yellow-400 font-medium mt-3">⚠️ 以下のリソースが無効化されます:</p>
                                                {simulationResult.jobsToDisable.length > 0 && (
                                                    <div>
                                                        <p className="text-gray-400">ジョブ ({simulationResult.jobsToDisable.length}個):</p>
                                                        <ul className="ml-4 text-gray-400">
                                                            {simulationResult.jobsToDisable.map((job: any) => (
                                                                <li key={job.id}>
                                                                    • {job.name} - {job.reason}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {simulationResult.apiKeysToDisable.length > 0 && (
                                                    <div>
                                                        <p className="text-gray-400">APIキー ({simulationResult.apiKeysToDisable.length}個):</p>
                                                        <ul className="ml-4 text-gray-400">
                                                            {simulationResult.apiKeysToDisable.map((key: any) => (
                                                                <li key={key.id}>
                                                                    • {key.name} - {key.reason}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {!simulationResult.changesRequired && (
                                            <p className="text-green-400">✅ リソースの無効化は不要です</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setSimulationResult(null);
                                }}
                                className="w-full px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
