import { verifySession } from "@/app/lib/dal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Verify user session
    await verifySession();
    
    // Construct the URL for the agents server
    const url = `${process.env.API_BASE_URL}/programs/program_flow/excel`;
    
    // Make the request to the agents server
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    if (!response.ok) {
      throw new Error(`Agents server responded with status: ${response.status}`);
    }

    // Get the response data as a blob
    const blob = await response.blob();
    
    // Get the filename from the response headers
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `generated_fitness_program.xlsx`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Return the Excel file
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error downloading Excel file:', error);
    return NextResponse.json(
      { error: 'Failed to download Excel file' },
      { status: 500 }
    );
  }
} 