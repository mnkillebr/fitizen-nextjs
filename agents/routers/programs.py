import time
from typing import Annotated
from fastapi import APIRouter, Form, Query
from fastapi.responses import StreamingResponse, FileResponse
import asyncio
import json
import pandas as pd
import io
import tempfile
import os

from agents.models.profile import Client, FitnessProfile
from agents.crews.parq_program_crew.parq_program_crew import client, fitness_profile, movement_patterns, movement_plane, balance_type, parq_program_crew, my_listener
from agents.flows.generate_program_flow.generate_program_flow import GenerateProgramFlow, test_fms

router = APIRouter(
    prefix="/programs",
    tags=["programs"]
)

def convert_program_to_excel(program_data):
    """
    Convert program data to Excel format with multiple sheets for each week
    """
    # Create a BytesIO object to store the Excel file
    excel_buffer = io.BytesIO()
    
    with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
        # Create summary sheet
        summary_rows = []
        summary_rows.append(['FITNESS PROGRAM SUMMARY'])
        summary_rows.append([])
        summary_rows.append(['Week', 'Days', 'Focus Areas'])
        
        for week_key, week_data in program_data.items():
            week_name = week_key.replace('week', 'Week ')
            days = len(week_data)
            focus_areas = []
            
            # Extract focus areas from the week
            for day_data in week_data:
                # Convert Pydantic model to dict if needed
                if hasattr(day_data, 'model_dump'):
                    day_data = day_data.model_dump()
                
                if day_data.get('power'):
                    focus_areas.append('Power')
                if day_data.get('circuit_1') or day_data.get('circuit_2'):
                    focus_areas.append('Strength/Circuit')
                if day_data.get('finisher'):
                    focus_areas.append('Conditioning')
            
            focus_areas = list(set(focus_areas))  # Remove duplicates
            summary_rows.append([week_name, days, ', '.join(focus_areas)])
        
        # Write summary sheet
        summary_df = pd.DataFrame(summary_rows)
        summary_df.to_excel(writer, sheet_name='Summary', index=False, header=False)
        
        # Format summary sheet
        summary_worksheet = writer.sheets['Summary']
        for column in summary_worksheet.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            summary_worksheet.column_dimensions[column_letter].width = adjusted_width
        
        # Process each week
        for week_key, week_data in program_data.items():
            week_name = week_key.replace('week', 'Week ')
            
            # Create a list to store all rows for this week
            week_rows = []
            
            # Process each day in the week
            for day_data in week_data:
                # Convert Pydantic model to dict if needed
                if hasattr(day_data, 'model_dump'):
                    day_data = day_data.model_dump()
                
                day_name = day_data.get('day', 'Unknown Day')
                
                # Add day header
                week_rows.append([f"=== {day_name} ==="])
                week_rows.append([])
                
                # Movement Prep section
                movement_prep = day_data.get('movement_prep', [])
                if movement_prep:
                    week_rows.append(['Movement Prep'])
                    for prep in movement_prep:
                        # Convert Pydantic model to dict if needed
                        if hasattr(prep, 'model_dump'):
                            prep = prep.model_dump()
                        
                        week_rows.append(['', prep.get('name', ''), prep.get('description', '')])
                        
                        # Add foam rolling exercises
                        foam_rolling = prep.get('foam_rolling', [])
                        if foam_rolling:
                            week_rows.append(['', '', 'Foam Rolling:'])
                            for exercise in foam_rolling:
                                week_rows.append(['', '', f'  • {exercise}'])
                        
                        # Add dynamic stretches
                        dynamic_stretches = prep.get('dynamic_stretches', [])
                        if dynamic_stretches:
                            week_rows.append(['', '', 'Dynamic Stretches:'])
                            for exercise in dynamic_stretches:
                                week_rows.append(['', '', f'  • {exercise}'])
                        
                        # Add activation exercises
                        activation_exercises = prep.get('activation_exercises', [])
                        if activation_exercises:
                            week_rows.append(['', '', 'Activation Exercises:'])
                            for exercise in activation_exercises:
                                week_rows.append(['', '', f'  • {exercise}'])
                    
                    week_rows.append([])
                
                # Power section
                power = day_data.get('power', '')
                if power:
                    week_rows.append(['Power', power])
                    week_rows.append([])
                
                # Circuit 1
                circuit_1 = day_data.get('circuit_1', {})
                if circuit_1:
                    # Convert Pydantic model to dict if needed
                    if hasattr(circuit_1, 'model_dump'):
                        circuit_1 = circuit_1.model_dump()
                    
                    week_rows.append(['Circuit 1'])
                    exercises = circuit_1.get('exercises', [])
                    for exercise in exercises:
                        # Convert Pydantic model to dict if needed
                        if hasattr(exercise, 'model_dump'):
                            exercise = exercise.model_dump()
                        
                        week_rows.append(['', exercise.get('name', ''), f"{exercise.get('reps', '')} reps", f"RPE {exercise.get('rpe', '')}"])
                    week_rows.append(['', f"Rounds: {circuit_1.get('rounds', '')}", f"Rest: {circuit_1.get('rest', '')} seconds"])
                    week_rows.append([])
                
                # Circuit 2
                circuit_2 = day_data.get('circuit_2', {})
                if circuit_2:
                    # Convert Pydantic model to dict if needed
                    if hasattr(circuit_2, 'model_dump'):
                        circuit_2 = circuit_2.model_dump()
                    
                    week_rows.append(['Circuit 2'])
                    exercises = circuit_2.get('exercises', [])
                    for exercise in exercises:
                        # Convert Pydantic model to dict if needed
                        if hasattr(exercise, 'model_dump'):
                            exercise = exercise.model_dump()
                        
                        week_rows.append(['', exercise.get('name', ''), f"{exercise.get('reps', '')} reps", f"RPE {exercise.get('rpe', '')}"])
                    week_rows.append(['', f"Rounds: {circuit_2.get('rounds', '')}", f"Rest: {circuit_2.get('rest', '')} seconds"])
                    week_rows.append([])
                
                # Finisher
                finisher = day_data.get('finisher', '')
                if finisher:
                    week_rows.append(['Finisher', finisher])
                    week_rows.append([])
                
                # Add spacing between days
                week_rows.append([])
                week_rows.append([])
            
            # Create DataFrame and write to Excel
            if week_rows:
                df = pd.DataFrame(week_rows)
                df.to_excel(writer, sheet_name=week_name, index=False, header=False)
                
                # Get the workbook and worksheet for formatting
                workbook = writer.book
                worksheet = writer.sheets[week_name]
                
                # Auto-adjust column widths
                for column in worksheet.columns:
                    max_length = 0
                    column_letter = column[0].column_letter
                    for cell in column:
                        try:
                            if len(str(cell.value)) > max_length:
                                max_length = len(str(cell.value))
                        except:
                            pass
                    adjusted_width = min(max_length + 2, 50)  # Cap at 50 characters
                    worksheet.column_dimensions[column_letter].width = adjusted_width
    
    # Reset buffer position
    excel_buffer.seek(0)
    return excel_buffer

async def event_generator():
    """Generate SSE events from the listener queue"""
    while True:
        event = my_listener.get_event()
        if event:
            if event["type"] == "crew_completed":
                yield f"data: {json.dumps(event)}\n\n"
                break
            yield f"data: {json.dumps(event)}\n\n"
        await asyncio.sleep(0.1)

@router.get("/parq_program/events")
async def get_crew_events():
    """SSE endpoint for getting crew execution events"""
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

@router.post("/parq_program")
async def getParQProgram(profileClient: Annotated[Client, Query()], profileData: Annotated[FitnessProfile, Form()]):
    start_time = time.perf_counter()
    
    # print("profile client", profileClient.model_dump())
    # print("profile data", profileData.model_dump())
    # Clear any previous events
    my_listener.clear_events()
    
    # Prepare inputs
    crew_inputs = {
        'client': profileClient.model_dump(),
        'fitness_profile': profileData.model_dump(),
        # 'client': client,
        # 'fitness_profile': fitness_profile,
        'movement_patterns': movement_patterns,
        'movement_plane': movement_plane,
        'balance_type': balance_type,
    }
    # Start the crew execution
    result = await parq_program_crew.kickoff_async(
        inputs=crew_inputs
    )
    raw_output = result.raw
    # pydantic_output = result.pydantic.model_dump()
    process_time = time.perf_counter() - start_time
    
    return {
        "process_time": process_time,
        # "pydantic_output": pydantic_output,
        "raw_output": raw_output,
    }

@router.get("/test_flow")
async def test_flow(country: Annotated[str | None, Query(max_length=30)] = None, format: Annotated[str | None, Query()] = "json"):
    """Test the flow and return either JSON or Excel file"""
    # Test FMS Inputs
    fms_input = test_fms
    start_time = time.perf_counter()

    print(f"Country: {country}")
    print(f"FMS Input: {fms_input}")

    flow = GenerateProgramFlow(query=country, fms=fms_input)
    # flow.plot()
    result = await flow.kickoff_async()

    process_time = time.perf_counter() - start_time

    # Return JSON format
    if format.lower() == "json":
        return {
            "process_time": process_time,
            "result": result,
        }
    
    # Return Excel format
    elif format.lower() == "excel":
        # Convert result to Excel format
        excel_buffer = convert_program_to_excel(result)
        
        # Create a temporary file to store the Excel data
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            tmp_file.write(excel_buffer.getvalue())
            tmp_file_path = tmp_file.name

        # Return the Excel file
        return FileResponse(
            path=tmp_file_path,
            filename=f"fitness_program_{country or 'default'}.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    
    else:
        return {"error": "Invalid format. Use 'json' or 'excel'"}

@router.get("/test_flow/excel")
async def test_flow_excel(country: Annotated[str | None, Query(max_length=30)] = None):
    """Test the flow and return Excel file directly"""
    # Test FMS Inputs
    fms_input = test_fms
    start_time = time.perf_counter()

    print(f"Country: {country}")
    print(f"FMS Input: {fms_input}")

    flow = GenerateProgramFlow(query=country, fms=fms_input)
    # flow.plot()
    result = await flow.kickoff_async()

    process_time = time.perf_counter() - start_time

    # Convert result to Excel format
    excel_buffer = convert_program_to_excel(result)
    
    # Create a temporary file to store the Excel data
    with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
        tmp_file.write(excel_buffer.getvalue())
        tmp_file_path = tmp_file.name

    # Return the Excel file
    return FileResponse(
        path=tmp_file_path,
        filename=f"fitness_program_{country or 'default'}.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )