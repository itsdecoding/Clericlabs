import { supabase, isSupabaseConfigured } from './supabase';
import { ContentCard, INITIAL_CARDS } from '@/data/mockData';

// Map database row (snake_case) to ContentCard (camelCase)
export function mapRowToCard(row: Record<string, any>): ContentCard {
  return {
    id: row.id,
    title: row.title || 'Untitled',
    type: row.type || 'IG Carousel',
    category: row.category || row.topic || undefined,
    status: row.status || 'Idea',
    priority: row.priority || undefined,
    assignee: row.assignee || undefined,
    slidesCount: row.slides_count || undefined,
    slideCopy: row.slide_copy || undefined,
    caption: row.caption || undefined,
    hashtags: row.hashtags || undefined,
    dueDate: row.due_date || undefined,
    scheduledDate: row.scheduled_date || undefined,
    postedAt: row.posted_at || undefined,
    tags: row.tags || undefined,
    briefUrl: row.brief_url || undefined,
    finalFilesUrl: row.final_files_url || undefined,
    coverImageUrl: row.cover_image_url || undefined,
    supportingAssetsUrl: row.supporting_assets_url || undefined,
    postedUrl: row.posted_url || undefined,
    owner: row.owner || undefined,
    pm: row.pm || row.project_manager || undefined,
    designer: row.designer || undefined,
    writer: row.writer || undefined,
    activityLog: row.activity_log || row.activities || [],
  };
}

// Map ContentCard (camelCase) to database row (snake_case)
export function mapCardToRow(card: Partial<ContentCard>): Record<string, any> {
  const row: Record<string, any> = {};

  if (card.id !== undefined) row.id = card.id;
  if (card.title !== undefined) row.title = card.title;
  if (card.type !== undefined) row.type = card.type;
  if (card.category !== undefined) {
    row.category = card.category;
    row.topic = card.category;
  }
  if (card.status !== undefined) row.status = card.status;
  if (card.priority !== undefined) row.priority = card.priority;
  if (card.assignee !== undefined) row.assignee = card.assignee;
  if (card.slidesCount !== undefined) row.slides_count = card.slidesCount;
  if (card.slideCopy !== undefined) row.slide_copy = card.slideCopy;
  if (card.caption !== undefined) row.caption = card.caption;
  if (card.hashtags !== undefined) row.hashtags = card.hashtags;
  if (card.dueDate !== undefined) row.due_date = card.dueDate;
  if (card.scheduledDate !== undefined) row.scheduled_date = card.scheduledDate;
  if (card.postedAt !== undefined) row.posted_at = card.postedAt;
  if (card.tags !== undefined) row.tags = card.tags;
  if (card.briefUrl !== undefined) row.brief_url = card.briefUrl;
  if (card.finalFilesUrl !== undefined) row.final_files_url = card.finalFilesUrl;
  if (card.coverImageUrl !== undefined) row.cover_image_url = card.coverImageUrl;
  if (card.supportingAssetsUrl !== undefined) row.supporting_assets_url = card.supportingAssetsUrl;
  if (card.postedUrl !== undefined) row.posted_url = card.postedUrl;
  if (card.owner !== undefined) row.owner = card.owner;
  if (card.pm !== undefined) {
    row.pm = card.pm;
    row.project_manager = card.pm;
  }
  if (card.designer !== undefined) row.designer = card.designer;
  if (card.writer !== undefined) row.writer = card.writer;
  if (card.activityLog !== undefined) {
    row.activity_log = card.activityLog;
    row.activities = card.activityLog;
  }

  return row;
}

// Fetch all cards from Supabase
export async function fetchCardsFromDb(): Promise<ContentCard[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('content_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error (table may not exist yet):', error.message);
      return null;
    }

    if (Array.isArray(data)) {
      return data.map(mapRowToCard);
    }

    return [];
  } catch (err) {
    console.warn('Error in fetchCardsFromDb:', err);
    return null;
  }
}

// Clear all cards from Supabase
export async function clearAllCardsInDb(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('content_cards')
      .delete()
      .neq('id', '___non_existent___');

    if (error) {
      console.warn('Supabase clear error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error in clearAllCardsInDb:', err);
    return false;
  }
}

// Insert or update a card in Supabase
export async function upsertCardInDb(card: Partial<ContentCard>): Promise<boolean> {
  if (!isSupabaseConfigured() || !card.id) return false;

  try {
    const row = mapCardToRow(card);
    const { error } = await supabase
      .from('content_cards')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error in upsertCardInDb:', err);
    return false;
  }
}

// Delete a card from Supabase
export async function deleteCardFromDb(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('content_cards')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error in deleteCardFromDb:', err);
    return false;
  }
}

// Seed INITIAL_CARDS into database if table is empty
export async function seedInitialCardsToDb(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const rows = INITIAL_CARDS.map(mapCardToRow);
    const { error } = await supabase
      .from('content_cards')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase seed error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error in seedInitialCardsToDb:', err);
    return false;
  }
}
