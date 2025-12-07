import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch current page layout
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 'home';

    const { data, error } = await supabase
      .from('page_layouts')
      .select('*')
      .eq('page', page)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return NextResponse.json({
      success: true,
      layout: data || null
    });
  } catch (error) {
    console.error('Error fetching page layout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page layout' },
      { status: 500 }
    );
  }
}

// POST - Save page layout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, layout, widgets } = body;

    // First, deactivate current layout
    await supabase
      .from('page_layouts')
      .update({ is_active: false })
      .eq('page', page)
      .eq('is_active', true);

    // Insert new layout
    const { data, error } = await supabase
      .from('page_layouts')
      .insert({
        page,
        layout,
        widgets,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      layout: data
    });
  } catch (error) {
    console.error('Error saving page layout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save page layout' },
      { status: 500 }
    );
  }
}

// PUT - Update existing layout
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, layout, widgets } = body;

    const { data, error } = await supabase
      .from('page_layouts')
      .update({
        layout,
        widgets,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      layout: data
    });
  } catch (error) {
    console.error('Error updating page layout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update page layout' },
      { status: 500 }
    );
  }
}