import { WorkoutForm } from "./workout-form";

export default function GenerateWorkoutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Generate Your Workout</h1>
      <WorkoutForm />
    </div>
  );
}