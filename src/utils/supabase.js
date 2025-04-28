import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export const getUserResumes = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

export const getResumeById = async (resumeId) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();
    
    if (error) throw error;
    
    // Make sure we're returning the data in the expected format
    if (data) {
      console.log('Resume data from DB:', data);
      return {
        id: data.id,
        name: data.name,
        data: data.data || {},
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

// Fix the updateResume function to properly handle the resumeId
export const updateResume = async (resumeId, resumeData, resumeName) => {
  try {
    console.log('Updating resume with ID:', resumeId);
    
    // Ensure resumeId is a string
    if (typeof resumeId !== 'string') {
      throw new Error('Resume ID must be a string');
    }
    
    const updates = { 
      data: resumeData,
      updated_at: new Date()
    };
    
    if (resumeName) {
      updates.name = resumeName;
    }
    
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', resumeId)
      .select();
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    console.log('Update result:', data);
    return data;
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

// Fix the saveResume function to return the created data
export const saveResume = async (userId, resumeData, resumeName) => {
  try {
    console.log('Creating new resume for user:', userId);
    
    const { data, error } = await supabase
      .from('resumes')
      .insert([
        { 
          user_id: userId, 
          name: resumeName || `Resume ${new Date().toLocaleString()}`, 
          data: resumeData 
        }
      ])
      .select();
    
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Save result:', data);
    return data;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
};

export const updateResumeName = async (resumeId, newName) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .update({ 
        name: newName,
        updated_at: new Date()
      })
      .eq('id', resumeId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating resume name:', error);
    throw error;
  }
};

export const deleteResume = async (resumeId) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};