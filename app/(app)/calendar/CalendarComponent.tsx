"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlusIcon } from "@/assets/icons";
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getHours, setHours, getMinutes, setMinutes, differenceInMinutes, differenceInDays, getDay, getTime, getDate, setMonth, getMonth, setDay, setDate, setYear, getYear } from 'date-fns';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { DatePickerDemo } from '@/components/DatePicker';
import { Appointment, Recurrence, WorkoutSession } from '@prisma/client';
// import EventForm from '@/components/ui/event-form';

type ViewType = 'daily' | 'weekly' | 'monthly';

const eventTitle = (title: string) => {
  switch (title) {
    case "GOAL_SETTING":
      return "Goal Setting"
    case "FOLLOWUP":
      return "Follow-up"
  }
}

interface EventType extends Appointment, WorkoutSession {
  coach: string;
  routineName: string;
}

interface EventChipProps {
  event: any;
  handleClick: (event: any) => void;
}

const EventChip = ({ event, handleClick }: EventChipProps) => {
  return (
    <div
      key={event.id}
      className={clsx(
        "text-xs py-1 px-4 font-semibold rounded-md cursor-pointer truncate",
        event.type ? "bg-primary" : "bg-teal-300 dark:bg-ring"
      )}
      onClick={() => handleClick(event)}
    >
      {event.type ? `${eventTitle(event.type)} with ${event.coach}` : `${event.routineName} Session`}
    </div>
  )
}

interface CalendarProps {
  currentTimeLineColor?: string;
  submitEvent: (args: any) => void;
  formOptions: {
    [key: string]: any;
  };
  schedule: {
    [key: string]: any;
  };
}

const Calendar: React.FC<CalendarProps> = ({ currentTimeLineColor = 'red', submitEvent = () => {}, formOptions = { coaches: [], userWorkouts: [] }, schedule = { appointments: [], userSessions: [] } }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [view, setView] = useState<ViewType>('daily');

  // const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  // const [eventType, setEventType] = useState<string | null>(null);
  // const openDialog = useOpenDialog();
  const { appointments, userSessions } = schedule
  // console.log("user sessions", userSessions, appointments)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const navigateToToday = () => setCurrentDate(new Date());

  const navigatePrevious = () => {
    switch (view) {
      case 'daily':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'weekly':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'monthly':
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'daily':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'weekly':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'monthly':
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const handleDayClick = (date: Date) => {
    // setSelectedDate(date);
    const clickedDay = setMinutes(date, 0)
    // console.log("clicked day", date, clickedDay)
    // setIsAddEventOpen(true);
    setSelectedDateTime(clickedDay);
    // openDialog(
    //   <EventForm
    //     selectedDateTime={clickedDay}
    //     submitEvent={submitEvent}
    //     formOptions={formOptions}
    //   />,
    //   {
    //     title: {
    //       text: "Add Event",
    //       className: "text-foreground",
    //     },
    //     closeButton: {
    //       show: true,
    //     },
    //   }
    // )
  };

  const handleAddEvent = () => {
    const time = new Date()
    // openDialog(
    //   <EventForm
    //     selectedDateTime={setHours(setMinutes(time, 0), parseInt(format(time, 'HH')) + 2)}
    //     submitEvent={submitEvent}
    //     formOptions={formOptions}
    //   />,
    //   {
    //     title: {
    //       text: "Add Event",
    //       className: "text-foreground",
    //     },
    //     closeButton: {
    //       show: true,
    //     },
    //   }
    // )
  }

  const handleTimeClick = (date: Date, minutes: number) => {
    // setSelectedDate(date);
    // setSelectedTime(time);
    // console.log("clicked time", date, minutes)
    const clickedTime = setMinutes(date, minutes)
    setSelectedDateTime(clickedTime);
    // setIsAddEventOpen(true);
    // openDialog(
    //   <EventForm
    //     selectedDateTime={clickedTime}
    //     submitEvent={submitEvent}
    //     formOptions={formOptions}
    //   />,
    //   {
    //     title: {
    //       text: "Add Event",
    //       className: "text-foreground",
    //     },
    //     closeButton: {
    //       show: true,
    //     },
    //   }
    // )
  };

  const handleEventClick = (event: EventType, incomingTime: Date) => {
    const eventTime = () => {
      const eventTime = new Date(event.startTime);
      const eventRecurrence = event.recurrence ? event.recurrence.toLowerCase() : undefined
      switch (eventRecurrence) {
        case "daily": {
          return setYear(setMonth(setDate(eventTime, getDate(incomingTime)), getMonth(incomingTime)), getYear(incomingTime))
        }
        case "weekly": {
          return setYear(setMonth(setDate(eventTime, getDate(incomingTime)), getMonth(incomingTime)), getYear(incomingTime))
        }
        case "monthly": {
          return setYear(setMonth(eventTime, getMonth(incomingTime)), getYear(incomingTime))
        }
        default: {
          return eventTime
        }
      }
    }
    setSelectedDateTime(eventTime());
    const eventDefaults = event.type ? {
      coachId: event.coachId,
      appointmentId: event.id,
      appointmentType: event.type.toLowerCase(),
      defaultTab: "Appointment",
    } : {
      workoutId: event.routineId,
      sessionId: event.id,
      recurrence: event.recurrence ? event.recurrence.toLowerCase() : undefined,
      defaultTab: "Workout",
    }
    const dialogTitle = event.type ? `${eventTitle(event.type)} with ${event.coach}` : `${event.routineName} Session`
    // openDialog(
    //   <EventForm
    //     selectedDateTime={eventTime()}
    //     submitEvent={submitEvent}
    //     formOptions={{
    //       ...formOptions,
    //       defaults: eventDefaults,
    //     }}
    //   />,
    //   {
    //     title: {
    //       text: dialogTitle,
    //       className: "text-foreground",
    //     },
    //     closeButton: {
    //       show: true,
    //     },
    //   }
    // )
  }

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const nonRecurringDayEvents = [...appointments, ...userSessions].filter((evt: any) => 
          isSameDay(evt.startTime, cloneDay) && !evt.recurrence
        );
        const dailyRecurringSessions = userSessions.filter((evt: any) =>
          evt.recurrence && evt.recurrence.toLowerCase() === "daily" && getTime(setHours(cloneDay, 23)) >= getTime(evt.startTime)
        )
        const weeklyRecurringSessions = userSessions.filter((evt: any) =>
          evt.recurrence && evt.recurrence.toLowerCase() === "weekly" && getDay(cloneDay) === getDay(evt.startTime) && getTime(setHours(cloneDay, 23)) >= getTime(evt.startTime)
        )
        const monthlyRecurringSessions = userSessions.filter((evt: any) =>
          evt.recurrence && evt.recurrence.toLowerCase() === "monthly" && getDate(cloneDay) === getDate(evt.startTime) && getTime(setHours(cloneDay, 23)) >= getTime(evt.startTime)
        )
        const dayDiff = differenceInDays(cloneDay, startDate)
        days.push(
          <div
            key={day.toString()}
            className={clsx(
              "p-2 border dark:border-border-muted rounded-lg overflow-hidden h-full relative",
              !isSameMonth(day, monthStart) ? "text-muted-foreground/65" : "",
              "hover:bg-primary/10 dark:hover:bg-primary/20 transition duration-100 bg-background-muted"
            )}
          >
            {dayDiff < 7
              ? (
                <div
                  className={clsx(isSameDay(day, new Date()) ? "bg-primary w-10 text-black rounded-t-md pt-1 px-1" : "")}
                  onClick={() => handleDayClick(cloneDay)}
                >
                  {format(day, "EEE")}
                </div>
              ) : null}
            <div
              className={clsx(
                isSameDay(day, new Date()) ? "bg-primary px-1 text-black" : "",
                dayDiff >= 7 ? "w-fit rounded-md mb-1" : "w-10 pb-1 rounded-b-md"
              )}
              onClick={() => handleDayClick(cloneDay)}
            >
              {formattedDate}
            </div>
            <div className="flex flex-col gap-y-1 overflow-y-auto">
              {/* Overflow behavior needs revisit */}
              {nonRecurringDayEvents.map((evt: any) => <EventChip key={evt.id} event={evt} handleClick={(event) => handleEventClick(event, cloneDay)} />)}
              {dailyRecurringSessions.map((evt: any) => <EventChip key={evt.id} event={evt} handleClick={(event) => handleEventClick(event, cloneDay)} />)}
              {weeklyRecurringSessions.map((evt: any) => <EventChip key={evt.id} event={evt} handleClick={(event) => handleEventClick(event, cloneDay)} />)}
              {monthlyRecurringSessions.map((evt: any) => <EventChip key={evt.id} event={evt} handleClick={(event) => handleEventClick(event, cloneDay)} />)}
            </div>
            <div className="h-full" onClick={() => handleDayClick(cloneDay)}></div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="h-[calc(100%-3.5rem)] grid grid-rows-5 gap-px shadow-md rounded-lg">{rows}</div>;
  };

  const renderHourColumn = (day: Date) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const isToday = isSameDay(day, new Date());
    const currentHour = getHours(currentTime);
    const currentMinute = getMinutes(currentTime);

    const dayEvents = [...appointments, ...userSessions].filter((evt: any) => 
      isSameDay(evt.startTime, day)
    );

    return (
      <div className="grid grid-cols-1 gap-px relative">
        <div className="absolute w-full">
          {hours.map((hour) => (
            <div
              key={hour}
              className="p-2 first:border-t-none first:rounded-t-lg last:rounded-b-lg border dark:border-border-muted bg-background-muted h-32 relative"
              // onClick={() => handleTimeClick(day, format(new Date().setHours(hour), 'HH:mm'))}
            >
              <span className="absolute left-2 top-2 z-20 text-xs text-muted-foreground">
                {format(new Date().setHours(hour), 'ha')}
              </span>
              {isToday && hour === currentHour && (
                <div
                  className="absolute left-0 right-0 z-20"
                  style={{
                    top: `${(currentMinute / 60) * 100}%`,
                    borderTop: `2px solid ${currentTimeLineColor}`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="absolute w-full z-10">
          {hours.map((hour) => (
            <div
              key={hour}
              className="p-2 h-32 relative"
              // onClick={() => handleTimeClick(day, format(new Date().setHours(hour), 'HH:mm'))}
            >
              {[0, 15, 30, 45].map((minute) => {
                const timeSlot = setMinutes(setHours(day, hour), minute);
                const slotEvents = dayEvents.filter((evt: any) => 
                  timeSlot >= new Date(evt.startTime) && timeSlot < new Date(evt.endTime)
                );
                return (
                  <div
                    key={minute}
                    className={clsx(
                      "absolute left-0 w-full h-1/4 pl-10 pr-2 transition duration-100",
                      !slotEvents.length ? "hover:bg-primary/20 dark:hover:bg-primary/30" : ""
                    )}
                    style={{ top: `${(minute / 60) * 100}%` }}
                    onClick={() => !slotEvents.length && handleTimeClick(setMinutes(setHours(day, hour), minute), minute)}
                  >
                    {slotEvents.map((evt: any) => {
                      if (getMinutes(evt.startTime) === minute) {
                        const slotHeight = (differenceInMinutes(evt.endTime, evt.startTime) + 1) / 15
                        return (
                          <div
                            key={evt.id}
                            className={clsx(
                              `h-${slotHeight*8} z-10 rounded-md cursor-pointer`,
                              "text-xs py-1 border dark:border-white/50 px-4 overflow-hidden font-semibold z-10",
                              evt.type ? "bg-primary" : "bg-teal-300 dark:bg-ring"
                            )}
                            onClick={() => handleEventClick(evt, day)}
                          >
                            {getMinutes(timeSlot) === getMinutes(evt.startTime) && evt.type ? `${eventTitle(evt.type)} with ${evt.coach}` : getMinutes(timeSlot) === getMinutes(evt.startTime) ? `${evt.routineName} Session` : ""}
                          </div>
                        )
                      } else {
                        return (
                          <div key={evt.id} className="h-full cursor-pointer" onClick={() => handleEventClick(evt, day)} />
                        )
                      }
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDailyView = () => {
    return (
      <div className="h-full">
        <h2 className="text-xl font-bold mb-4">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
        <div className="h-[calc(100%-6.25rem)] overflow-y-auto shadow-md border-t rounded-lg">
          {renderHourColumn(currentDate)}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="h-[calc(100%-3.5rem)] shadow-md rounded-lg flex flex-col">
        <div className="grid grid-cols-7 gap-px z-10 sticky top-0">
          {days.map((day) => (
            <div
              key={day.toString()}
              className={clsx(
                "border border-b-2 dark:border-border-muted dark:border-b-white/50 bg-background-muted h-full rounded-t-lg p-2",
                isSameDay(day, new Date()) ? "bg-primary text-foreground" : ""
              )}>
              <div>{format(day, "EEE")}</div>
              <div>{format(day, "d")}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto relative">
          <div className="grid grid-cols-7 gap-px absolute w-full">
            {days.map((day) => {
              return (
                <div key={day.toString()} className="border-x dark:border-border-muted bg-background-muted">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="p-2 border-b dark:border-border-muted h-24 relative"
                      // onClick={() => handleTimeClick(day, format(new Date().setHours(hour), 'HH:mm'))}
                    >
                      <span className="absolute left-2 top-2 z-10 text-xs text-muted-foreground">
                        {format(new Date().setHours(hour), 'ha')}
                      </span>
                      {isSameDay(day, new Date()) &&
                        hour === getHours(currentTime) && (
                          <div
                            className="absolute left-0 right-0 z-20"
                            style={{
                              top: `${(getMinutes(currentTime) / 60) * 100}%`,
                              borderTop: `2px solid ${currentTimeLineColor}`,
                            }}
                          />
                        )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-7 gap-px absolute w-full">
            {days.map((day) => {
              const dayEvents = [...appointments, ...userSessions].filter((evt: any) => 
                isSameDay(evt.startTime, day)
              );
              return (
                <div key={day.toString()}>
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="p-2 h-24 relative"
                      // onClick={() => handleTimeClick(day, format(new Date().setHours(hour), 'HH:mm'))}
                    >
                      {[0, 15, 30, 45].map((minute) => {
                        const timeSlot = setMinutes(setHours(day, hour), minute);
                        const slotEvents = dayEvents.filter((evt: any) => 
                          timeSlot >= new Date(evt.startTime) && timeSlot < new Date(evt.endTime)
                        );
                        return (
                          <div
                            key={minute}
                            className={clsx(
                              "absolute left-0 w-full h-1/4 pl-2 md:pl-10 pr-2",
                              slotEvents.length ? "cursor-pointer" : "hover:bg-primary/20 dark:hover:bg-primary/30 transition duration-100"
                            )}
                            style={{ top: `${(minute / 60) * 100}%` }}
                            onClick={() => !slotEvents.length && handleTimeClick(setMinutes(setHours(day, hour), minute), minute)}
                          >
                            {slotEvents.map((evt: any) => {
                              if (getMinutes(evt.startTime) === minute) {
                                const slotHeight = (differenceInMinutes(evt.endTime, evt.startTime) + 1) / 15
                                return (
                                  <div
                                    key={evt.id}
                                    className={clsx(
                                      `h-${slotHeight*6} z-10 rounded-md`,
                                      "text-xs py-1 border dark:border-white/50 px-4 overflow-hidden font-semibold z-10",
                                      evt.type ? "bg-primary" : "bg-teal-300 dark:bg-ring"
                                    )}
                                    onClick={() => handleEventClick(evt, day)}
                                  >
                                    {getMinutes(timeSlot) === getMinutes(evt.startTime) && evt.type ? `${eventTitle(evt.type)} with ${evt.coach}` : getMinutes(timeSlot) === getMinutes(evt.startTime) ? `${evt.routineName} Session` : ""}
                                  </div>
                                )
                              } else {
                                return (
                                  <div key={evt.id} className="h-full" onClick={() => handleEventClick(evt, day)} />
                                )
                              }
                            })}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2 pb-5 md:px-3 md:pb-6 h-full overflow-hidden bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Button onClick={navigatePrevious} className="hover:shadow-md text-foreground bg-background-muted dark:border dark:border-border-muted dark:hover:shadow-border-muted hover:text-black transition duration-100">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={navigateNext} className="hover:shadow-md text-foreground bg-background-muted dark:border dark:border-border-muted dark:hover:shadow-border-muted hover:text-black transition duration-100">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={navigateToToday} className="md:hidden text-black">T</Button>
          <Button onClick={navigateToToday} className="hidden md:flex text-black">Today</Button>
        </div>
        {/* <h2 className="md:hidden text-xl font-bold">
          {format(currentDate, "MMM yyyy")}
        </h2>
        <h2 className="hidden md:flex text-xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2> */}
        <DatePickerDemo currentDate={currentDate} setCurrentDate={setCurrentDate} />
        {/* <DatePicker
          currentDate={currentDate}
          view={view}
          onDateChange={setCurrentDate}
        /> */}
        <div className="flex lg:hidden items-center">
          <Button onClick={() => setView("daily")} className={view === "daily" ? "text-black" : "bg-background-muted text-muted-foreground hover:bg-primary/35 transition duration-100"}>D</Button>
          <Button onClick={() => setView("weekly")} className={view === "weekly" ? "text-black" : "bg-background-muted text-muted-foreground hover:bg-primary/35 transition duration-100"}>W</Button>
          <Button onClick={() => setView("monthly")} className={view === "monthly" ? "text-black" : "bg-background-muted text-muted-foreground hover:bg-primary/35 transition duration-100"}>M</Button>
          <Button
            onClick={handleAddEvent}
            className="items-center"
          >
            <PlusIcon className="h-4 w-4" />
            {/* Add Event */}
          </Button>
        </div>
        <div className="hidden lg:flex items-center">
          <Button onClick={() => setView("daily")} className={view === "daily" ? "text-black" : "bg-background-muted text-muted-foreground hover:bg-primary/35 transition duration-100"}>Daily</Button>
          <Button onClick={() => setView("weekly")} className={view === "weekly" ? "text-black" : "bg-background-muted text-muted-foreground hover:bg-primary/35 transition duration-100"}>Weekly</Button>
          <Button onClick={() => setView("monthly")} className={view === "monthly" ? "text-black" : "bg-background-muted text-muted-foreground hover:bg-primary/35 transition duration-100"}>Monthly</Button>
          <Button
            onClick={handleAddEvent}
            className="items-center bg-background-muted text-muted-foreground hover:text-foreground hover:shadow-md dark:border dark:border-border-muted dark:hover:shadow-border-muted transition duration-100"
          >
            <PlusIcon className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {view === "monthly" && renderMonthlyView()}
      {view === "weekly" && renderWeeklyView()}
      {view === "daily" && renderDailyView()}

      {/* <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Add Event</Dialog.Title>
          </Dialog.Header>
          <div>
            Add event form fields here
          </div>
          <Dialog.Footer>
            <Button onClick={() => setIsAddEventOpen(false)}>Cancel</Button>
            <Button>Save</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog> */}
    </div>
  );
};

export default Calendar;