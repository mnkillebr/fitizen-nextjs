import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from crewai.utilities.events.crew_events import CrewKickoffStartedEvent, CrewKickoffCompletedEvent
from crewai.utilities.events.agent_events import AgentExecutionCompletedEvent, AgentExecutionStartedEvent
from crewai.utilities.events.task_events import TaskCompletedEvent, TaskStartedEvent
from crewai.utilities.events.base_event_listener import BaseEventListener
from queue import Queue
from typing import Dict, Any
import time

class MyCustomListener(BaseEventListener):
    def __init__(self):
        super().__init__()
        self.event_queue = Queue()
        self.crew_id = None

    def setup_listeners(self, crewai_event_bus):
        @crewai_event_bus.on(CrewKickoffStartedEvent)
        def on_crew_started(source, event):
            self.crew_id = event.crew_name
            self.event_queue.put({
                "type": "crew_started",
                "crew_name": event.crew_name,
                "timestamp": time.time()
            })

        @crewai_event_bus.on(CrewKickoffCompletedEvent)
        def on_crew_completed(source, event):
            self.event_queue.put({
                "type": "crew_completed",
                "crew_name": event.crew_name,
                "output": event.output,
                "timestamp": time.time()
            })

        @crewai_event_bus.on(AgentExecutionCompletedEvent)
        def on_agent_execution_completed(source, event):
            self.event_queue.put({
                "type": "agent_completed",
                "agent_role": event.agent.role,
                "output": event.output,
                "timestamp": time.time()
            })

    def get_event(self):
        """Get the next event from the queue if available"""
        try:
            return self.event_queue.get_nowait()
        except:
            return None

    def clear_events(self):
        """Clear all events from the queue"""
        while not self.event_queue.empty():
            self.event_queue.get()