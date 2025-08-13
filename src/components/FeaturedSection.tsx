'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye, Heart, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseClient } from '@/lib/supabase'

interface FeaturedContent {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  reading_time: number
  view_count: number
  like_count: number
  comment_count: number
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

export function FeaturedSection() {
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchFeaturedContent()
  }, [])

  const fetchFeaturedContent = async () => {
    try {
      // Fetch featured articles
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
          like_count,
          comment_count,
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
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

      // Fetch featured journals
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
          like_count,
          comment_count,
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
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

      const combined = [
        ...(articles || []).map(item => ({ ...item, type: 'article' as const })),
        ...(journals || []).map(item => ({ ...item, type: 'journal' as const }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setFeaturedContent(combined.slice(0, 6))
    } catch (error) {
      console.error('Error fetching featured content:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-20 mb-3" />
                  <div className="h-6 bg-muted rounded mb-3" />
                  <div className="h-4 bg-muted rounded mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-4 bg-muted rounded w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Content</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of the most engaging articles, journals, and insights
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredContent.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={item.featured_image || 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge 
                    className="text-white border-0"
                    style={{ backgroundColor: item.category?.color || '#3B82F6' }}
                  >
                    {item.category?.name || 'Uncategorized'}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    {item.type === 'article' ? 'Article' : 'Journal'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/${item.type}s/${item.slug}`}>
                    {item.title}
                  </Link>
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.reading_time} min
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {item.view_count}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {item.like_count}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {item.comment_count}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {item.author?.avatar_url ? (
                        <Image
                          src={item.author.avatar_url}
                          alt={item.author.full_name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-xs font-medium">
                          {item.author?.full_name?.charAt(0) || 'A'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.author?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${item.type}s/${item.slug}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/articles">
              View All Featured Content
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}