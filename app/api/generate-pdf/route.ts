import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import PortfolioPDF from '../../../../components/pdf/PortfolioPDF';

function getPortfolioPDFDocument(props: any) {
  return <PortfolioPDF {...props} />;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = body.user;
    const sections = body.sections;
    const achievements = body.achievements;
    const projects = body.projects;
    const participations = body.participations;

    if (!user || !sections) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Create the PDF document using the helper
    const doc = getPortfolioPDFDocument({
      user,
      sections,
      achievements,
      projects,
      participations,
    });

    // Render PDF to a buffer (no disk writes)
    const buffer = await renderToBuffer(doc);

    // Return the PDF as a buffer response
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="portfolio.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
} 