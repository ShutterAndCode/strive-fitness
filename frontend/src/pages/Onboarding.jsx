import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PersonStanding,
  Scale,
  ScaleIcon,
  TargetIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/useAppContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Slider from "../components/ui/Slider";
import toast, { Toaster } from "react-hot-toast";

import mockApi from "../services/mockAPI";
import { ageRanges, goalOptions } from "../assets/assets";
import ThemeToggle from "../components/ThemeToggle";
import api from "../services/api";
const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;
  const { user, setIsOnboardingCompleted, fetchUser } = useAppContext();
  const [formData, setFormData] = useState({
    age: 0,
    weight: 0,
    height: 0,
    goal: "maintain",
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400,
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleNext = async () => {
    if (step === 1) {
      const age = Number(formData.age);

      if (!formData.age || Number.isNaN(age) || age < 13 || age > 120) {
        toast.error("Please enter a valid age between 13 and 120.");
        return;
      }
    }

    if (step === 2) {
      const weight = Number(formData.weight);
      const height = Number(formData.height);

      if (
        !formData.weight ||
        Number.isNaN(weight) ||
        weight < 20 ||
        weight > 300
      ) {
        toast.error(
          "Please enter a valid weight between 20 and 300 kg and height between 100 and 250 cm.",
        );
        return;
      }

      if (
        !formData.height ||
        Number.isNaN(height) ||
        height < 100 ||
        height > 250
      ) {
        toast.error(
          "Please enter a valid weight between 20 and 300 kg, and height between 100 and 250 cm.",
        );
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const userData = {
        ...formData,
        // createdAt: new Date().toISOString(),
      };

      setIsSubmitting(true);

      try {
        await api.user.update(userData);
        await fetchUser();
        toast.success("Profile updated successfully");
        setIsOnboardingCompleted(true);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Unable to save your profile. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }

      // localStorage.setItem("fitnessUser", JSON.stringify(userData));
      // await mockApi.user.update(user?.id || "", userData);
      // toast.success("Profile updated successfully");
      // setIsOnboardingCompleted(true);
      // fetchUser(user?.token || "");
    }
  };
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">
        <div className="mb-4 flex justify-end">
          <ThemeToggle className="bg-white/80 text-slate-700 shadow-sm backdrop-blur dark:bg-slate-800/80 dark:text-slate-200" />
        </div>
        <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <PersonStanding className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Welcome to Strive
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Let&apos;s personalize your experience
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Complete your onboarding to unlock your dashboard.
            </p>
          </div>
          {/* progressIndicator */}
          <div className="px-6 mb-8 onboarding-wrapper">
            <div className="flex gap-2 max-w-2xl">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-emerald-500" : "bg-red-200 dark:bg-slate-900"}`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-400 mt-3">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>
        {/* Form DATA */}
        <div className="flex-1 mt-6 px-6 onboarding-wrapper">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center border size-12 rounded-xl bg-emerald-500 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
                  <User className="text-emerald-600 size-6 dark:text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    How old are you?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This helps us calculate your daily calorie needs.
                  </p>
                </div>
              </div>

              <Input
                label="Age"
                type="number"
                className="max-w-2xl"
                value={formData.age}
                onChange={(v) => updateField("age", v)}
                placeholder="Enter your age"
                min={13}
                max={120}
                required
              />
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center border size-12 rounded-xl bg-emerald-500 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
                  <ScaleIcon className="text-emerald-600 size-6 dark:text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    What's your current body measurements?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    We'll use this to personalize your calorie goals.
                  </p>
                </div>
              </div>

              <Input
                label="Weight (kg)"
                type="number"
                className="max-w-2xl"
                value={formData.weight}
                onChange={(v) => updateField("weight", v)}
                placeholder="Enter your weight"
                min={20}
                max={300}
                required
              />
              <Input
                label="Height (cm)"
                type="number"
                className="max-w-2xl"
                value={formData.height}
                onChange={(v) => updateField("height", v)}
                placeholder="Enter your height in cm"
                min={100}
                max={250}
                required
              />
            </div>
          )}
          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center border size-12 rounded-xl bg-emerald-500 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800">
                  <TargetIcon className="text-emerald-600 size-6 dark:text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    What's your goal?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    We'll use this to tailor your experience.
                  </p>
                </div>
              </div>
              {/* options */}
              <div className="space-y-4 max-w-lg">
                {goalOptions.map((option) => (
                  <button
                    className={`onboarding-option-btn ${formData.goal === option.value && "ring-2 ring-emerald-500"}`}
                    key={option.value}
                    onClick={() => {
                      const age = Number(formData.age);
                      const range =
                        ageRanges.find((r) => age <= r.max) ||
                        ageRanges[ageRanges.length - 1];
                      let intake = range.maintain;
                      let burn = range.burn;
                      if (option.value == "lose") {
                        intake = intake - 250;
                        burn = burn + 100;
                      } else if (option.value === "gain") {
                        intake = intake + 500;
                        burn = burn - 100;
                      }
                      setFormData({
                        ...formData,
                        goal: option.value,
                        dailyCalorieIntake: intake,
                        dailyCalorieBurn: burn,
                      });
                    }}
                  >
                    <span className="text-base text-slate-700 dark:text-slate-200">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 my-6 max-w-lg"></div>

              {/* dailyTargets */}
              <div className="space-y-8 max-w-lg">
                <h3 className="text-md font-medium text-slate-800 dark:text-white mb-4">
                  Daily Targets
                </h3>
                <div className="space-y-6">
                  <Slider
                    onChange={(t) => {
                      updateField("dailyCalorieIntake", t);
                    }}
                    unit="kcal"
                    infoText="The total calories you plan to consume each day"
                    label="Daily Calorie Intake"
                    min={500}
                    max={4000}
                    step={50}
                    value={formData.dailyCalorieIntake}
                  />
                  <Slider
                    onChange={(t) => {
                      updateField("dailyCalorieBurn", t);
                    }}
                    unit="kcal"
                    infoText="The total calories you plan to burn through exercises and activity each day"
                    label="Daily Calorie Burn"
                    min={100}
                    max={1500}
                    step={50}
                    value={formData.dailyCalorieBurn}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Navigation BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 pt-6 sm:flex-row sm:justify-end ">
            {step > 1 && (
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => setStep((current) => Math.max(1, current - 1))}
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeftIcon className="h-5 w-5" />
                  Back
                </span>
              </Button>
            )}

            <Button
              className="w-full sm:w-auto"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting
                  ? "Saving..."
                  : step === totalSteps
                    ? "Get Started"
                    : "Continue"}
                <ArrowRightIcon className="h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Onboarding;
