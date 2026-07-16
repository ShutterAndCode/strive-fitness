import { useMemo, useState } from "react";
import { useAppContext } from "../context/useAppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { PlusIcon, SparkleIcon, UtensilsCrossedIcon } from "lucide-react";
import mockApi from "../services/mockAPI";
import toast from "react-hot-toast";

const ActivityLog = () => {
  const { allActivityLogs, setAllActivityLogs } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    calories: 0,
  });
  const [editingEntry, setEditingEntry] = useState(null);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const normalizeDate = (value) => {
    if (!value) return "";
    const stringValue = typeof value === "string" ? value : value.toISOString();
    return stringValue.split("T")[0];
  };

  const todayActivities = useMemo(
    () =>
      (allActivityLogs || []).filter(
        (item) => normalizeDate(item.createdAt || item.date) === today,
      ),
    [allActivityLogs, today],
  );

  const totalMinutes = todayActivities.reduce(
    (sum, item) => sum + (item.duration || 0),
    0,
  );

  const handleQuickAdd = (activityName) => {
    setEditingEntry(null);
    setFormData({
      name: activityName,
      duration: 30,
      calories: 0,
    });
    setShowForm(true);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      name: entry.name || "",
      duration: entry.duration || 30,
      calories: entry.calories || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (documentId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this entry?",
      );
      if (!confirm) return;
      await mockApi.activityLogs.delete(documentId);
      setAllActivityLogs((prev) =>
        prev.filter((entry) => entry.documentId !== documentId),
      );
      toast.success("Entry deleted successfully!");
    } catch (error) {
      console.error(`could not delete:`, error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "could not delete entry",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (editingEntry) {
        const { data } = await mockApi.activityLogs.update(
          editingEntry.documentId,
          formData,
        );
        setAllActivityLogs((prev) =>
          prev.map((entry) =>
            entry.documentId === editingEntry.documentId ? data : entry,
          ),
        );
      } else {
        const { data } = await mockApi.activityLogs.create(formData);
        setAllActivityLogs((prev) => [...prev, data]);
      }
      setFormData({ name: "", duration: 30, calories: 0 });
      setEditingEntry(null);
      setShowForm(false);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Unable to save activity. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                Activity Log
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Track your workouts.
              </p>
            </div>
            <div className="text-right">
              <p className="tet-sm text-slate-500 dark:text-slate-400">
                Active today
              </p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {totalMinutes} min
              </p>
            </div>
          </div>
        </div>

        <div className="page-content-grid">
          {!showForm && (
            <div className="space-y-4">
              <Card>
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
                  Quick Add
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickAdd("Morning Run")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    🏃 Morning Run
                  </button>
                  <button
                    onClick={() => handleQuickAdd("Cycling")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    🚴 Cycling
                  </button>
                  <button
                    onClick={() => handleQuickAdd("Yoga")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-pink-300 hover:bg-pink-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    🧘 Yoga
                  </button>
                  <button
                    onClick={() => handleQuickAdd("Walking")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    🚶 Walking
                  </button>
                </div>
              </Card>

              <Button className="w-full" onClick={() => setShowForm(true)}>
                <PlusIcon className="size-5" />
                Add Activity
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setFormData({ name: "", duration: 30, calories: 0 });
                  setShowForm(true);
                }}
              >
                <SparkleIcon className="size-5" />
                Quick Start
              </Button>
            </div>
          )}

          {showForm && (
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
                {editingEntry ? "Edit Activity" : "Add Activity"}
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  label="Activity Name"
                  placeholder="e.g. Morning Run"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(value) =>
                    setFormData({ ...formData, name: value.toString() })
                  }
                />
                <Input
                  label="Duration (minutes)"
                  placeholder="30"
                  type="number"
                  min={1}
                  required
                  value={formData.duration}
                  onChange={(value) =>
                    setFormData({ ...formData, duration: Number(value) })
                  }
                />
                <Input
                  label="Calories Burned"
                  placeholder="300"
                  type="number"
                  min={0}
                  required
                  value={formData.calories}
                  onChange={(value) =>
                    setFormData({ ...formData, calories: Number(value) })
                  }
                />
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1"
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingEntry(null);
                      setFormData({ name: "", duration: 30, calories: 0 });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {loading
                      ? "Saving..."
                      : editingEntry
                        ? "Update Activity"
                        : "Save Activity"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-4">
            {todayActivities.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossedIcon className="size-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  No activities logged today
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add a workout to start tracking your day.
                </p>
              </Card>
            ) : (
              todayActivities.map((entry) => (
                <Card
                  key={entry.documentId || entry.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">
                        {entry.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {entry.duration} minutes • {entry.calories} kcal
                      </p>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      {entry.duration} min
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleEdit(entry)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex-1 text-red-800 bg-red-300"
                      onClick={() => handleDelete(entry.documentId)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityLog;
