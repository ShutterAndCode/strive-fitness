import { getMotivationalMessage } from "../assets/assets";
import { useAppContext } from "../context/useAppContext";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import {
  ActivityIcon,
  FlameIcon,
  HamburgerIcon,
  RulerIcon,
  ScaleIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
import CaloriesChart from "../components/ui/CaloriesChart";

const Dashboard = () => {
  const { user, allActivityLogs, allFoodLogs } = useAppContext();

  const DAILY_CALORIE_LIMIT = user?.dailyCalorieIntake || 2000;
  const dailyBurnGoal =
    user?.dailyCalorieBurn ?? user?.dailyCalorieBurned ?? 400;

  const today = new Date().toISOString().split("T")[0];
  const normalizeDate = (value) => {
    if (!value) return "";
    const stringValue = typeof value === "string" ? value : value.toISOString();
    return stringValue.split("T")[0];
  };

  const todayFood = (allFoodLogs || []).filter(
    (item) => normalizeDate(item.createdAt || item.date) === today,
  );
  const todayActivity = (allActivityLogs || []).filter(
    (item) => normalizeDate(item.createdAt || item.date) === today,
  );

  const totalCalories = todayFood.reduce(
    (sum, item) => sum + (item.calories || 0),
    0,
  );
  const totalActiveMinutes = todayActivity.reduce(
    (sum, item) => sum + (item.duration || 0),
    0,
  );
  const totalBurned = todayActivity.reduce(
    (sum, item) => sum + (item.calories || 0),
    0,
  );
  const motivation = getMotivationalMessage(
    totalCalories,
    totalActiveMinutes,
    DAILY_CALORIE_LIMIT,
  );
  const remainingCalories = DAILY_CALORIE_LIMIT - totalCalories;

  return (
    <>
      <div className="page-container">
        {/* header */}
        <div className="dashboard-header">
          <p className="text-emerald-100 text-sm font-medium">Welcome back</p>
          <h1 className="text-2xl font-bold mt-1">{`Hi, There ${user?.username}`}</h1>

          {/* motivation card */}
          <div className="mt-6 bg-white/20 backdrop-blur-sm rounder-2xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{motivation.emoji}</span>
              <p className="text-white font-medium">{motivation.text}</p>
            </div>
          </div>
        </div>

        {/*main content */}
        <div className="dashboard-grid">
          {/* calories card */}
          <Card className="shadow-lg col-span-2 space-y-4">
            <div className="space-y-2">
              <span className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <HamburgerIcon className="w-6 h-6 text-orange-500" />
              </span>
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-white">
                  Calories consumed
                </span>

                <span>
                  {totalCalories}/{DAILY_CALORIE_LIMIT}
                </span>
              </div>

              <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
            </div>
            <div className="flex items-center justify-between">
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 ${
                  remainingCalories >= 0
                    ? "bg-emerald-100/70 dark:bg-emerald-500/10"
                    : "bg-red-100/70 dark:bg-red-500/10"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    remainingCalories >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {remainingCalories >= 0
                    ? `${remainingCalories} remaining`
                    : `${Math.abs(remainingCalories)} over`}
                </p>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {remainingCalories >= 0
                  ? `${Math.round((remainingCalories / DAILY_CALORIE_LIMIT) * 100)}%`
                  : "0%"}
              </p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
            <div className="space-y-2">
              <span className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <FlameIcon className="text-orange-500" />
              </span>
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-white">
                  Calories burned
                </span>

                <span>
                  {totalBurned}/{dailyBurnGoal}
                </span>
              </div>
              <ProgressBar value={totalBurned} max={dailyBurnGoal} />
              {/* can add some claases when over or remaining */}
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex items-center rounded-full px-3 py-1 ${
                    totalBurned >= dailyBurnGoal
                      ? "bg-emerald-100/70 dark:bg-emerald-500/10"
                      : "bg-amber-100/70 dark:bg-amber-500/10"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      totalBurned >= dailyBurnGoal
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {totalBurned} burned
                  </p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {`${Math.round((totalBurned / dailyBurnGoal) * 100)}%`}
                </p>
              </div>
            </div>
          </Card>
          {/* Stats row */}
          <div className="dashboard-card-grid">
            {/* <active minutes */}
            <Card>
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <ActivityIcon className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500">Active</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {totalActiveMinutes}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                minutes today
              </p>
            </Card>
            {/* <activity counts */}
            <Card>
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <ZapIcon className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-sm text-slate-500">Workouts</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {todayActivity.length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                activities logged
              </p>
            </Card>
          </div>
          {/* GoalCard */}
          {user && (
            <Card className="bg-linear-to-r from-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Your Goal</p>
                  <p className="text-white font-semibold capitalize">
                    {user.goal === "lose" && "Lose Weight"}
                    {user.goal === "maintain" && "Maintain Weight"}
                    {user.goal === "lose" && "Gain Muscle Weight"}
                  </p>
                </div>
              </div>
            </Card>
          )}
          {/* {Body metrics card} */}
          {user && user.weight && (
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <ScaleIcon className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    Body Metrics
                  </h3>
                  <p className="text-slate-500 text-sm">Your Stats</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <ScaleIcon className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Weight
                    </span>
                  </div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {user.weight} kg
                  </span>
                </div>
                {user.height && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <RulerIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Height
                      </span>
                    </div>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      {user.height} cms
                    </span>
                  </div>
                )}
                {user.weight && user.height && (
                  <div className="pt-2 border-t border-s-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        BMI
                      </span>
                      {(() => {
                        const bmi = (
                          user.weight / Math.pow(user.height / 100, 2)
                        ).toFixed(1);
                        const getStatus = (v) => {
                          if (v < 18.5)
                            return {
                              color: `text-blue-500`,
                              bg: "bg-blue-500",
                            };
                          if (v < 25)
                            return {
                              color: `text-emerald-500`,
                              bg: "bg-emerald-500",
                            };
                          if (v < 30)
                            return {
                              color: `text-orange-500`,
                              bg: "bg-orange-500",
                            };
                          if (v > 30)
                            return { color: `text-red-500`, bg: "bg-red-500" };
                        };
                        const status = getStatus(Number(bmi));
                        return (
                          <span className={`text-lg font-bold ${status.color}`}>
                            {bmi}
                          </span>
                        );
                      })()}
                    </div>
                    {/* bmi scalevisual */}
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="flex-1 bg-blue-400 opacity-30"></div>
                      <div className="flex-1 bg-emerald-400 opacity-30"></div>
                      <div className="flex-1 bg-orange-400 opacity-30"></div>
                      <div className="flex-1 bg-red-400 opacity-30"></div>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span>18.5</span>

                      <span>25</span>
                      <span>30</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
          {/* Quk summary */}
          <Card>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              Today's Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  Meals logged
                </span>
                <span className="text-spate-700 font-medium dark:text-slate-200">
                  {todayFood.length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  Total Calories
                </span>
                <span className="text-spate-700 font-medium dark:text-slate-200">
                  {totalCalories} kCal
                </span>
              </div>
              <div className="flex justify-between items-center py-2  dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  Active Time
                </span>
                <span className="text-spate-700 font-medium dark:text-slate-200">
                  {totalActiveMinutes} mins
                </span>
              </div>
            </div>
          </Card>
          {/* Activity, calorie Chart */}
          <Card className="col-span-2">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">
              This week's progress
            </h3>
            <CaloriesChart></CaloriesChart>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
