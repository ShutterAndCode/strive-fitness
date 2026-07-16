import { useState } from "react";
import { useAppContext } from "../context/useAppContext";
import {
  UserCircle2Icon,
  SparklesIcon,
  HeartPulseIcon,
  ArrowRightCircleIcon,
} from "lucide-react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/ThemeToggle";
import mockApi from "../services/mockAPI";
import Select from "../components/ui/Select";
import { goalOptions } from "../assets/assets";
const Profile = () => {
  const { user, logout, setUser, allFoodLogs, allActivityLogs } =
    useAppContext();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [formData, setFormData] = useState(() => ({
    age: user?.age || 0,
    weight: user?.weight || 0,
    height: user?.height || 0,
    goal: user?.goal || "maintain",
    dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
    dailyCalorieBurn: user?.dailyCalorieBurn || 300,
  }));

  if (!user) return null;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "-";

  const handleSaveProfile = async () => {
    setSaving(true);
    setProfileError("");

    try {
      const { data } = await mockApi.user.update(user.id, formData);
      setUser({ ...data, token: user.token });
      setEditing(false);
    } catch {
      setProfileError("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="page-header flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Profile
            </h1>
            <p className="text-slate-500 text-sm mt-1 dark:text-slate-400">
              Manage your account
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] m-3">
          <div className="space-y-6">
            <Card className="space-y-5 p-6 border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-950/60 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <UserCircle2Icon className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Your profile
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Member since {memberSince}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Age
                  </p>
                  {editing ? (
                    <Input
                      label=""
                      type="number"
                      min={0}
                      value={formData.age}
                      onChange={(value) =>
                        setFormData({ ...formData, age: Number(value) })
                      }
                    />
                  ) : (
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      {formData.age}
                    </p>
                  )}
                </Card>
                <Card className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Weight
                  </p>
                  {editing ? (
                    <Input
                      label=""
                      type="number"
                      min={0}
                      value={formData.weight}
                      onChange={(value) =>
                        setFormData({ ...formData, weight: Number(value) })
                      }
                    />
                  ) : (
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      {formData.weight} kg
                    </p>
                  )}
                </Card>
                <Card className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Height
                  </p>
                  {editing ? (
                    <Input
                      label=""
                      type="number"
                      min={0}
                      value={formData.height}
                      onChange={(value) =>
                        setFormData({ ...formData, height: Number(value) })
                      }
                    />
                  ) : (
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      {formData.height} cm
                    </p>
                  )}
                </Card>
                <Card className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Goal
                  </p>
                  {editing ? (
                    <Select
                      value={formData.goal}
                      onChange={(value) =>
                        setFormData({ ...formData, goal: value })
                      }
                      options={goalOptions}
                    />
                  ) : (
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      {formData.goal}
                    </p>
                  )}
                </Card>
              </div>

              {profileError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {profileError}
                </p>
              )}

              {editing ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                  >
                    <SparklesIcon className="h-4 w-4" />
                    {saving ? "Saving..." : "Save profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setProfileError("");
                      if (user) {
                        setFormData({
                          age: user?.age || 0,
                          weight: user?.weight || 0,
                          height: user?.height || 0,
                          goal: user?.goal || "maintain",
                          dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
                          dailyCalorieBurn: user?.dailyCalorieBurn || 300,
                        });
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-950 dark:bg-slate-200 dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  <SparklesIcon className="h-4 w-4" />
                  Edit profile
                </button>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Your stats
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Overview of your daily progress
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <HeartPulseIcon className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-4 ">
                <Card className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-emerald-400/20">
                  <p className="text-sm text-green-500 dark:text-green-400">
                    Food entries
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {allFoodLogs?.length || 0}
                  </p>
                </Card>
                <Card className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-blue-400/20">
                  <p className="text-sm text-blue-500 dark:text-blue-400">
                    Activities
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    {allActivityLogs?.length || 0}
                  </p>
                </Card>
              </div>

              <button
                type="button"
                onClick={logout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-900 dark:text-red-200"
              >
                <ArrowRightCircleIcon className="h-4 w-4" />
                Logout
              </button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
