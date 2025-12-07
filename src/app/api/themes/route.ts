import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all themes
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      themes: data || []
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

// POST - Create new theme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, colors, fonts, spacing } = body;

    const { data, error } = await supabase
      .from('themes')
      .insert({
        name,
        colors,
        fonts,
        spacing,
        is_active: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      theme: data
    });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create theme' },
      { status: 500 }
    );
  }
}

// PUT - Update theme
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, colors, fonts, spacing, is_active } = body;

    // If activating a theme, deactivate others
    if (is_active) {
      await supabase
        .from('themes')
        .update({ is_active: false })
        .neq('id', id);
    }

    const { data, error } = await supabase
      .from('themes')
      .update({
        name,
        colors,
        fonts,
        spacing,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      theme: data
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

// DELETE - Delete theme
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Theme ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('themes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Theme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete theme' },
      { status: 500 }
    );
  }
}