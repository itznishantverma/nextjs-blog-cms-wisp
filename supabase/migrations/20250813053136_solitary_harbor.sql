/*
  # AelVorm Platform Schema

  1. New Tables
    - `profiles` - User profiles with roles
    - `articles` - News articles and main content
    - `journals` - Blogs, opinions, interviews, tips, poems
    - `quizzes` - Quiz definitions
    - `quiz_questions` - Questions for quizzes
    - `quiz_attempts` - User quiz attempts
    - `daily_gk` - Daily general knowledge posts
    - `categories` - Content categories
    - `tags` - Content tags
    - `bookmarks` - User bookmarks
    - `comments` - User comments
    - `content_versions` - Version history for content
    - `approval_history` - Approval/rejection history

  2. Security
    - Enable RLS on all tables
    - Role-based access policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'author', 'contributor', 'editor', 'legaleditor', 'moderator', 'user');
CREATE TYPE content_status AS ENUM ('draft', 'pending', 'underreview', 'rejected', 'approved', 'published', 'archived');
CREATE TYPE content_type AS ENUM ('article', 'journal', 'quiz', 'daily_gk');
CREATE TYPE journal_type AS ENUM ('blog', 'opinion', 'interview', 'tips', 'poem', 'other');

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  icon text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  location text,
  social_links jsonb DEFAULT '{}',
  role user_role DEFAULT 'user',
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Articles table (news and main content)
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  meta_title text,
  meta_description text,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status content_status DEFAULT 'draft',
  is_featured boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  is_editors_choice boolean DEFAULT false,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  reading_time integer DEFAULT 0,
  published_at timestamptz,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  rejected_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  rejected_at timestamptz,
  rejection_reason text,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Journals table (blogs, opinions, interviews, tips, poems)
CREATE TABLE IF NOT EXISTS journals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  meta_title text,
  meta_description text,
  journal_type journal_type DEFAULT 'blog',
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status content_status DEFAULT 'draft',
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  reading_time integer DEFAULT 0,
  published_at timestamptz,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  rejected_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  rejected_at timestamptz,
  rejection_reason text,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  featured_image text,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit integer, -- in minutes
  total_questions integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  status content_status DEFAULT 'draft',
  view_count integer DEFAULT 0,
  attempt_count integer DEFAULT 0,
  published_at timestamptz,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  rejected_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  rejected_at timestamptz,
  rejection_reason text,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL, -- Array of options
  correct_answer integer NOT NULL, -- Index of correct option
  explanation text,
  points integer DEFAULT 1,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  answers jsonb NOT NULL, -- User's answers
  score integer DEFAULT 0,
  total_points integer DEFAULT 0,
  percentage real DEFAULT 0,
  completed_at timestamptz,
  time_taken integer, -- in seconds
  created_at timestamptz DEFAULT now()
);

-- Daily GK table
CREATE TABLE IF NOT EXISTS daily_gk (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  content text NOT NULL,
  featured_image text,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  status content_status DEFAULT 'draft',
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  published_at timestamptz,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  rejected_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  rejected_at timestamptz,
  rejection_reason text,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content versions table
CREATE TABLE IF NOT EXISTS content_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type NOT NULL,
  content_id uuid NOT NULL,
  version integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  changes_summary text,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Approval history table
CREATE TABLE IF NOT EXISTS approval_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type NOT NULL,
  content_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'published', 'unpublished')),
  actor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reason text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Junction tables
CREATE TABLE IF NOT EXISTS article_tags (
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS journal_tags (
  journal_id uuid REFERENCES journals(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (journal_id, tag_id)
);

CREATE TABLE IF NOT EXISTS quiz_tags (
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (quiz_id, tag_id)
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  content_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  content_id uuid NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  status text DEFAULT 'published' CHECK (status IN ('published', 'pending', 'spam', 'deleted')),
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_gk ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS user_role AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (
  get_user_role(auth.uid()) IN ('superadmin', 'admin')
);

-- Articles policies
CREATE POLICY "Published articles are viewable by everyone" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can view their own articles" ON articles FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Editors can view all articles" ON articles FOR SELECT USING (
  get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'legaleditor', 'moderator')
);
CREATE POLICY "Authors can create articles" ON articles FOR INSERT WITH CHECK (
  auth.uid() = author_id AND get_user_role(auth.uid()) IN ('superadmin', 'admin', 'author', 'contributor', 'editor')
);
CREATE POLICY "Authors can update their own articles" ON articles FOR UPDATE USING (
  auth.uid() = author_id OR get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'legaleditor')
);

-- Similar policies for journals, quizzes, daily_gk...
CREATE POLICY "Published journals are viewable by everyone" ON journals FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can view their own journals" ON journals FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Editors can view all journals" ON journals FOR SELECT USING (
  get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'legaleditor', 'moderator')
);
CREATE POLICY "Authors can create journals" ON journals FOR INSERT WITH CHECK (
  auth.uid() = author_id AND get_user_role(auth.uid()) IN ('superadmin', 'admin', 'author', 'contributor', 'editor')
);
CREATE POLICY "Authors can update their own journals" ON journals FOR UPDATE USING (
  auth.uid() = author_id OR get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'legaleditor')
);

-- Quiz policies
CREATE POLICY "Published quizzes are viewable by everyone" ON quizzes FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can view their own quizzes" ON quizzes FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Editors can view all quizzes" ON quizzes FOR SELECT USING (
  get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'moderator')
);
CREATE POLICY "Authors can create quizzes" ON quizzes FOR INSERT WITH CHECK (
  auth.uid() = author_id AND get_user_role(auth.uid()) IN ('superadmin', 'admin', 'author', 'contributor', 'editor')
);

-- Quiz questions policies
CREATE POLICY "Quiz questions are viewable with quiz" ON quiz_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.status = 'published')
);
CREATE POLICY "Quiz authors can manage questions" ON quiz_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = quiz_questions.quiz_id AND 
    (quizzes.author_id = auth.uid() OR get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor')))
);

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily GK policies
CREATE POLICY "Published daily GK is viewable by everyone" ON daily_gk FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can view their own daily GK" ON daily_gk FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Editors can view all daily GK" ON daily_gk FOR SELECT USING (
  get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'moderator')
);
CREATE POLICY "Authors can create daily GK" ON daily_gk FOR INSERT WITH CHECK (
  auth.uid() = author_id AND get_user_role(auth.uid()) IN ('superadmin', 'admin', 'author', 'contributor', 'editor')
);

-- Categories and tags policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor')
);
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Users can create tags" ON tags FOR INSERT WITH CHECK (
  get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'author', 'contributor')
);

-- Junction table policies
CREATE POLICY "Article tags are viewable by everyone" ON article_tags FOR SELECT USING (true);
CREATE POLICY "Journal tags are viewable by everyone" ON journal_tags FOR SELECT USING (true);
CREATE POLICY "Quiz tags are viewable by everyone" ON quiz_tags FOR SELECT USING (true);

-- Bookmarks policies
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Published comments are viewable by everyone" ON comments FOR SELECT USING (status = 'published');
CREATE POLICY "Users can insert their own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (
  auth.uid() = author_id OR get_user_role(auth.uid()) IN ('superadmin', 'admin', 'moderator')
);

-- Content versions policies
CREATE POLICY "Authors can view versions of their content" ON content_versions FOR SELECT USING (
  created_by = auth.uid() OR get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor')
);
CREATE POLICY "Authors can create versions" ON content_versions FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Approval history policies
CREATE POLICY "Approval history is viewable by editors" ON approval_history FOR SELECT USING (
  get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'legaleditor', 'moderator')
);
CREATE POLICY "Editors can create approval history" ON approval_history FOR INSERT WITH CHECK (
  get_user_role(auth.uid()) IN ('superadmin', 'admin', 'editor', 'legaleditor', 'moderator')
);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_daily_gk_updated_at BEFORE UPDATE ON daily_gk FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, color, icon) VALUES
('Technology', 'technology', 'Latest tech news and updates', '#3B82F6', 'Laptop'),
('Science', 'science', 'Scientific discoveries and research', '#10B981', 'Microscope'),
('Politics', 'politics', 'Political news and analysis', '#EF4444', 'Vote'),
('Sports', 'sports', 'Sports news and updates', '#F59E0B', 'Trophy'),
('Entertainment', 'entertainment', 'Movies, music, and celebrity news', '#8B5CF6', 'Film'),
('Health', 'health', 'Health and wellness articles', '#06B6D4', 'Heart'),
('Business', 'business', 'Business and finance news', '#84CC16', 'TrendingUp'),
('Education', 'education', 'Educational content and resources', '#F97316', 'GraduationCap')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug) VALUES
('Breaking News', 'breaking-news'),
('Analysis', 'analysis'),
('Opinion', 'opinion'),
('Interview', 'interview'),
('Tutorial', 'tutorial'),
('Review', 'review'),
('Tips', 'tips'),
('Guide', 'guide')
ON CONFLICT (slug) DO NOTHING;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();