import { AnalyticsData } from "@/lib/analytics-server";
import { Protect } from "@clerk/nextjs";
import {
    Users,
    MousePointer,
    Globe,
    TrendingUp,
    ExternalLink,
    Calendar,
    Link,
    Clock,
    MapPin,
    Lock,
} from "lucide-react";

interface DashboardMetricsProps {
    analytics: AnalyticsData;
}

function DashboardMetrics({ analytics }: DashboardMetricsProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatReferrer = (referrer: string | null) => {
        if (!referrer || referrer === "direct") return "Direct";
        try {
            const url = new URL(referrer);
            return url.hostname.replace("www.", "");
        } catch {
            return referrer;
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-gray-200/50 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Analytics Overview
                        </h2>
                        <p className="text-gray-600">Last 30 days performance metrics</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        {/* Total Clicks */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-500 rounded-xl">
                                    <MousePointer className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-blue-600">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Total Clicks</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {analytics.totalClicks.toLocaleString()}
                            </p>
                        </div>

                        {/* Unique Visitors */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-500 rounded-xl">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-purple-600">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-purple-600 mb-1">
                                Unique Visitors
                            </p>
                            <p className="text-3xl font-bold text-purple-900">
                                {analytics.uniqueVisitors.toLocaleString()}
                            </p>
                        </div>

                        {/* Countries Reached */}
                        <Protect
                            plan="Ultra"
                            fallback={
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 opacity-75">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-green-500/50 rounded-xl">
                                            <Globe className="w-6 h-6 text-white/75" />
                                        </div>
                                        <div className="text-green-600/75">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <p className="text-sm font-medium text-green-600/75 mb-1">Countries</p>
                                    <p className="text-xl font-bold text-green-900/75">Upgrade to Ultra</p>
                                </div>
                            }
                        >
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-500 rounded-xl">
                                        <Globe className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-green-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-green-600 mb-1">Countries</p>
                                <p className="text-3xl font-bold text-green-900">
                                    {analytics.countriesReached.toLocaleString()}
                                </p>
                            </div>
                        </Protect>

                        {/* Total Links Clicked */}
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-indigo-500 rounded-xl">
                                    <Link className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-indigo-600">
                                    <ExternalLink className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-indigo-600 mb-1">Links Clicked</p>
                            <p className="text-3xl font-bold text-indigo-900">
                                {analytics.totalLinksClicked.toLocaleString()}
                            </p>
                        </div>

                        {/* Activity Period */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-500 rounded-xl">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-orange-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-orange-600 mb-1">Last Activity</p>
                            <p className="text-lg font-bold text-orange-900">
                                {formatDate(analytics.lastClick)}
                            </p>
                        </div>


                    </div>


                    {/* Top Referrer */}
                    {analytics.topReferrer && (
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-slate-500 rounded-lg">
                                    <Globe className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="font-semibold text-slate-900">Top Referrer</h3>
                            </div>
                            <p className="text-slate-700 font-medium">
                                {formatReferrer(analytics.topReferrer)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardMetrics;