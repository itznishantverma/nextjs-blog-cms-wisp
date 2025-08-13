'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, Clock, Eye, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseClient } from '@/lib/supabase'

interface TrendingContent {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  reading_time: number
  view_count: number
  created_at: string
  author: {
    full_name: string
    avatar_url: string
  }
  category: {
    name: string
    color: string
  }
  type: 'article' | 'journal'
}

export function TrendingSection() {
  const [trendingContent, setTrendingContent] = useState<TrendingContent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchTrendingContent()
  }, [])

  const fetchTrendingContent = async () => {
    try {
      // Fetch trending articles
      const { data: articles } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          reading_time,
          view_count,
          created_at,
          profiles:author_id (
            full_name,
            avatar_url
          ),
          categories:category_id (
            name,
            color
          )
        `)
        .eq('status', 'published')
        .eq('is_trending', true)
        .order('view_count', { ascending: false })
        .limit(4)

      // Fetch trending journals
      const { data: journals } = await supabase
        .from('journals')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          reading_time,
          view_count,
          created_at,
          profiles:author_id (
            full_name,
            avatar_url
          ),
          categories:category_id (
            name,
            color
          )
        `)
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(4)

      const combined = [
        ...(articles || []).map(item => ({ ...item, type: 'article' as const })),
        ...(journals || []).map(item => ({ ...item, type: 'journal' as const }))
      ].sort((a, b) => b.view_count - a.view_count)

      setTrendingContent(combined.slice(0, 8))
    } catch (error) {
      console.error('Error fetching trending content:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="h-8 bg-muted rounded w-48 mb-4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-96 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-16 mb-2" />
                  <div className="h-5 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold">Trending Now</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Most popular content based on reader engagement
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="/trending">
              View All Trending
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingContent.map((item, index) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={item.featured_image || 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-black/50 text-white border-0 text-xs"
                  >
                    {item.type === 'article' ? 'Article' : 'Journal'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <Badge 
                  className="text-xs mb-2 border-0"
                  style={{ backgroundColor: item.category?.color || '#3B82F6', color: 'white' }}
                >
                  {item.category?.name || 'Uncategorized'}
                </Badge>
                
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/${item.type}s/${item.slug}`}>
                    {item.title}
                  </Link>
                </h3>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.reading_time}m
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {item.view_count.toLocaleString()}
                    </div>
                  </div>
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" asChild>
            <Link href="/trending">
              View All Trending
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}