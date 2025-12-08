import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Mock analytics data - replace with real Google Analytics API integration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Generate mock data based on days parameter
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Generate page views data
    const pageViews = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      pageViews.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 100) + 20
      });
    }

    // Mock analytics data
    const mockData = {
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: days
      },
      metrics: {
        totalUsers: Math.floor(Math.random() * 1000) + 500,
        sessions: Math.floor(Math.random() * 1500) + 800,
        pageViews: pageViews.reduce((sum, item) => sum + item.views, 0),
        bounceRate: (Math.random() * 30 + 40).toFixed(2),
        avgSessionDuration: (Math.random() * 180 + 120).toFixed(1)
      },
      charts: {
        pageViews,
        topPages: [
          { page: '/', views: Math.floor(Math.random() * 200) + 100 },
          { page: '/portfolio', views: Math.floor(Math.random() * 150) + 80 },
          { page: '/about', views: Math.floor(Math.random() * 100) + 50 },
          { page: '/contact', views: Math.floor(Math.random() * 80) + 30 },
          { page: '/properties/123', views: Math.floor(Math.random() * 60) + 20 }
        ],
        trafficSources: [
          { name: 'Organic Search', value: Math.floor(Math.random() * 300) + 200 },
          { name: 'Direct', value: Math.floor(Math.random() * 200) + 150 },
          { name: 'Social Media', value: Math.floor(Math.random() * 150) + 100 },
          { name: 'Referral', value: Math.floor(Math.random() * 100) + 50 },
          { name: 'Email', value: Math.floor(Math.random() * 80) + 30 }
        ],
        demographics: {
          age: [
            { age: '18-24', users: Math.floor(Math.random() * 100) + 50 },
            { age: '25-34', users: Math.floor(Math.random() * 150) + 80 },
            { age: '35-44', users: Math.floor(Math.random() * 120) + 60 },
            { age: '45-54', users: Math.floor(Math.random() * 90) + 40 },
            { age: '55+', users: Math.floor(Math.random() * 70) + 30 }
          ],
          gender: [
            { gender: 'Male', users: Math.floor(Math.random() * 200) + 150 },
            { gender: 'Female', users: Math.floor(Math.random() * 180) + 130 },
            { gender: 'Other', users: Math.floor(Math.random() * 50) + 20 }
          ]
        },
        geography: {
          countries: [
            { country: 'Indonesia', users: Math.floor(Math.random() * 300) + 200 },
            { country: 'Malaysia', users: Math.floor(Math.random() * 100) + 50 },
            { country: 'Singapore', users: Math.floor(Math.random() * 80) + 40 },
            { country: 'Thailand', users: Math.floor(Math.random() * 60) + 30 },
            { country: 'Vietnam', users: Math.floor(Math.random() * 40) + 20 }
          ],
          cities: [
            { city: 'Jakarta', users: Math.floor(Math.random() * 150) + 100 },
            { city: 'Surabaya', users: Math.floor(Math.random() * 80) + 50 },
            { city: 'Bandung', users: Math.floor(Math.random() * 60) + 30 },
            { city: 'Medan', users: Math.floor(Math.random() * 40) + 20 },
            { city: 'Semarang', users: Math.floor(Math.random() * 35) + 15 }
          ]
        }
      },
      lastUpdated: new Date().toISOString()
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}