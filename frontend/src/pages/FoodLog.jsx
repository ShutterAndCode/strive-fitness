import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/useAppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import {
  Loader2Icon,
  PlusIcon,
  SparkleIcon,
  UtensilsCrossedIcon,
} from "lucide-react";
import Input from "../components/ui/Input";
import { mealTypeOptions } from "../assets/assets";
import mockApi from "../services/mockAPI";
import toast from "react-hot-toast";

const FoodLog = () => {
  const [loading] = useState(false);
  const inputRef = useRef(null);
  const { allFoodLogs, setAllFoodLogs } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    calories: 0,
    mealType: "",
  });
  const [editingEntry, setEditingEntry] = useState(null);

  const normalizeDate = (value) => {
    if (!value) return "";
    const stringValue = typeof value === "string" ? value : value.toISOString();
    return stringValue.split("T")[0];
  };

  const entries = (allFoodLogs || []).filter(
    (item) => normalizeDate(item.createdAt || item.date) === today,
  );

  const totalCalories = entries.reduce(
    (sum, item) => sum + (item.calories || 0),
    0,
  );
  // study grouped entries
  const groupedEntries = entries.reduce((acc, entry) => {
    const key = entry.mealType || "other";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(entry);
    return acc;
  }, {});

  const handleQuickAdd = (activityName) => {
    setEditingEntry(null);
    setFormData({ name: "", calories: 0, mealType: activityName });
    setShowForm(true);
  };
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    //implement ai logic
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      name: entry.name || "",
      calories: entry.calories || 0,
      mealType: entry.mealType || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (documentId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this entry?",
      );
      if (!confirm) return;
      await mockApi.foodLogs.delete(documentId);
      setAllFoodLogs((prev) =>
        prev.filter((entry) => entry.documentId !== documentId),
      );
      toast.success("Entry deleted successfully!");
    } catch (error) {
      console.error(`could not delete:`, error);
      toast.error(error?.message || "could not delete entry");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingEntry) {
      const { data } = await mockApi.foodLogs.update(editingEntry.documentId, {
        ...editingEntry,
        ...formData,
      });
      setAllFoodLogs((prev) =>
        prev.map((entry) =>
          entry.documentId === editingEntry.documentId ? data : entry,
        ),
      );
    } else {
      const { data } = await mockApi.foodLogs.create({ data: formData });
      setAllFoodLogs((prev) => [...prev, data]);
    }

    setFormData({ name: "", calories: 0, mealType: "" });
    setEditingEntry(null);
    setShowForm(false);
  };
  useEffect(() => {
    console.log("entries changed:", entries);
  }, [entries]);
  return (
    <>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                Food Log
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Track your daily intake.
              </p>
            </div>
            <div className="text-right">
              <p className="tet-sm text-slate-500 dark:text-slate-400">
                Today's Total
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalCalories} kcal
              </p>
            </div>
          </div>
        </div>
        <div className="page-content-grid">
          {/* quickaddsection */}
          {!showForm && (
            <div className="space-y-4">
              <Card>
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
                  Quick Add
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickAdd("breakfast")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    🌅 Breakfast
                  </button>
                  <button
                    onClick={() => handleQuickAdd("lunch")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    🍱 Lunch
                  </button>
                  <button
                    onClick={() => handleQuickAdd("snack")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-pink-300 hover:bg-pink-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    🍪 Snacks
                  </button>
                  <button
                    onClick={() => handleQuickAdd("dinner")}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    🌙 Dinner
                  </button>
                </div>
              </Card>
              <Button
                className="w-full"
                onClick={() => {
                  setShowForm(true);
                }}
              >
                <PlusIcon className="size-5" />
                Add Food Entry
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                <SparkleIcon className="size-5" />
                AI Food Snap
              </Button>
              <input
                onChange={handleImageChange}
                type="file"
                name=""
                id=""
                accept="image/*"
                hidden
                ref={inputRef}
              />
              {loading && (
                <div className="fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur flex items-center justify-center z-100">
                  <Loader2Icon className="size-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
                </div>
              )}
            </div>
          )}

          {/* /Add Form */}

          {showForm && (
            <Card className="border-2 border-emerald-200 dark:border-emerald-800">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
                {editingEntry ? "Edit Food Entry" : "New Food Entry"}
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  label="Food Name"
                  placeholder="Arhar Dal"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(v) => {
                    setFormData({ ...formData, name: v.toString() });
                  }}
                />
                <Input
                  label="Calories"
                  placeholder="200"
                  type="number"
                  min={1}
                  required
                  value={formData.calories}
                  onChange={(v) => {
                    setFormData({ ...formData, calories: Number(v) });
                  }}
                />
                <Select
                  label="Meal Type"
                  placeholder="Select Meal Type"
                  options={mealTypeOptions}
                  required
                  value={formData.mealType}
                  onChange={(v) => {
                    setFormData({ ...formData, mealType: v.toString() });
                  }}
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1"
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: "", calories: 0, mealType: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Entry
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Entries List */}
          {entries.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossedIcon className="size-8 text-slate-400 dark:text-slate500" />
              </div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                No Food Logged Today
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Start your meals to stay on target
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {["breakfast", "lunch", "snack", "dinner", "other"].map(
                (mealType) => {
                  const mealEntries = groupedEntries[mealType];
                  if (!mealEntries || mealEntries.length === 0) return null;

                  return (
                    <Card key={mealType} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-800 dark:text-white capitalize">
                          {mealType}
                        </h4>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {mealEntries.length} item
                          {mealEntries.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {mealEntries.map((entry) => (
                          <div
                            key={entry.documentId || entry.id}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-slate-800 dark:text-slate-100">
                                {entry.name}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {entry.calories} kcal
                              </p>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {entry.mealType}
                            </p>
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
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FoodLog;
