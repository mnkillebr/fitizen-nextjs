import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from crewai.utilities.events.crew_events import CrewKickoffStartedEvent, CrewKickoffCompletedEvent
from crewai.utilities.events.agent_events import AgentExecutionCompletedEvent, AgentExecutionStartedEvent
from crewai.utilities.events.task_events import TaskCompletedEvent, TaskStartedEvent
from crewai.utilities.events.flow_events import FlowStartedEvent, FlowFinishedEvent, MethodExecutionStartedEvent, MethodExecutionFinishedEvent
from crewai.utilities.events.base_event_listener import BaseEventListener
from queue import Queue
from typing import Dict, Any
import time

class MyCustomListener(BaseEventListener):
    def __init__(self):
        super().__init__()
        self.event_queue = Queue()
        self.crew_id = None
        self.flow_id = None

    def setup_listeners(self, crewai_event_bus):
        @crewai_event_bus.on(CrewKickoffStartedEvent)
        def on_crew_started(source, event):
            print(f"Crew started: {event.crew_name}")
            self.crew_id = event.crew_name
            self.event_queue.put({
                "type": "crew_started",
                "crew_name": event.crew_name,
                "timestamp": time.time()
            })

        @crewai_event_bus.on(CrewKickoffCompletedEvent)
        def on_crew_completed(source, event):
            print(f"Crew completed: {event.crew_name}")
            self.event_queue.put({
                "type": "crew_completed",
                "crew_name": event.crew_name,
                # Convert to string to ensure JSON-serializable payloads
                "output": str(event.output) if event.output is not None else None,
                "timestamp": time.time()
            })


        @crewai_event_bus.on(AgentExecutionStartedEvent)
        def on_agent_execution_started(source, event):
            print(f"Agent started: {event.agent.role}")
            self.event_queue.put({
                "type": "agent_started",
                "agent_role": event.agent.role,
                "timestamp": time.time()
            })

        @crewai_event_bus.on(AgentExecutionCompletedEvent)
        def on_agent_execution_completed(source, event):
            print(f"Agent completed: {event.agent.role}")
            self.event_queue.put({
                "type": "agent_completed",
                "agent_role": event.agent.role,
                # Convert to string to ensure JSON-serializable payloads
                "output": str(event.output) if event.output is not None else None,
                "timestamp": time.time()
            })

        @crewai_event_bus.on(FlowStartedEvent)
        def on_flow_started(source, event):
            print(f"Flow started: {event.flow_name}")
            self.flow_id = event.flow_name
            self.event_queue.put({
                "type": "flow_started",
                "flow_name": event.flow_name,
                "timestamp": time.time()
            })

        @crewai_event_bus.on(FlowFinishedEvent)
        def on_flow_finished(source, event):
            print(f"Flow finished: {event.flow_name}")
            self.event_queue.put({
                "type": "flow_finished",
                "flow_name": event.flow_name,
                # Convert to string to ensure JSON-serializable payloads
                "output": str(event.result) if event.result is not None else None,
                "timestamp": time.time()
            })

        @crewai_event_bus.on(MethodExecutionStartedEvent)
        def on_method_execution_started(source, event):
            print(f"Method started: {event.flow_name} - {event.method_name}")
            self.event_queue.put({
                "type": "method_started",
                "flow_name": event.flow_name,
                "method_name": event.method_name,
                "timestamp": time.time()
            })

        @crewai_event_bus.on(MethodExecutionFinishedEvent)
        def on_method_execution_finished(source, event):
            print(f"Method finished: {event.flow_name} - {event.method_name}")
            self.event_queue.put({
                "type": "method_finished",
                "flow_name": event.flow_name,
                "method_name": event.method_name,
                # Convert to string to ensure JSON-serializable payloads
                "output": str(event.result) if event.result is not None else None,
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