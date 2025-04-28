import CalendarComponent from "./CalendarComponent";

export default async function CalendarPage() {
  return (
    <div className="@container">
      <div className="h-[calc(100vh-4rem)]">
        <CalendarComponent 
          // submitEvent={() => {}}
          // formOptions={{ coaches: [], userWorkouts: [] }}
          // schedule={{ appointments: [], userSessions: [] }}
        />
      </div>
    </div>
  );
}