'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Award, Clock, Eye, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseClient } from '@/lib/supabase'

interface EditorsChoiceContent {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  reading_time: number
  view_count: number
  like_count: number
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

export function EditorsChoiceSection() {
  const [editorsChoice, setEditorsChoice] = useState<EditorsChoiceContent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchEditorsChoice()
  }, [])

  const fetchEditorsChoice = async () => {
    try {
      // Fetch editor's choice articles
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
        .eq('is_editors_choice', true)
        .order('created_at', { ascending: false })
        .limit(3)

      setEditorsChoice((articles || []).map(item => ({ ...item, type: 'article' as const })))
    } catch (error) {
      console.error('Error fetching editors choice:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-20 mb-3" />
                  <div className="h-6 bg-muted rounded mb-3" />
                  <div className="h-16 bg-muted rounded mb-4" />
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

  if (editorsChoice.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold">Editor's Choice</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Carefully curated content selected by our editorial team for exceptional quality and insight
          </p>
        </div>

        {/* Editor's Choice Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {editorsChoice.map((item, index) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={item.featured_image || 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                    <Award className="w-3 h-3 mr-1" />
                    Editor's Choice
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge 
                    className="text-white border-0 mb-2"
                    style={{ backgroundColor: item.category?.color || '#3B82F6' }}
                  >
                    {item.category?.name || 'Uncategorized'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
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
                      {item.reading_time} min read
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {item.view_count.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {item.like_count}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
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
                  
                  <Button variant="ghost" size="sm" asChild className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
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
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/editors-choice">
              View All Editor's Choice
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}