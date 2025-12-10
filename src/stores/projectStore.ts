import { create } from 'zustand';
import type { Project, ProjectFilters, SortOption } from '@/types';
import { mockProjects } from '@/services/mockData';

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  filters: ProjectFilters;
  sortOption: SortOption;
  isLoading: boolean;
  
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (project: Partial<Project>) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setFilters: (filters: ProjectFilters) => void;
  setSortOption: (sortOption: SortOption) => void;
  clearFilters: () => void;
}

export const useProjectStore = create<ProjectStore>()((set, get) => ({
  projects: [],
  selectedProject: null,
  filters: {},
  sortOption: { field: 'updatedAt', direction: 'desc' },
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let projects = [...mockProjects];
      const { filters, sortOption } = get();

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        projects = projects.filter(p => filters.status!.includes(p.status));
      }
      if (filters.type && filters.type.length > 0) {
        projects = projects.filter(p => filters.type!.includes(p.type));
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        projects = projects.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      projects.sort((a, b) => {
        const aVal = a[sortOption.field as keyof Project];
        const bVal = b[sortOption.field as keyof Project];
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOption.direction === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOption.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        return 0;
      });

      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ isLoading: false });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const project = mockProjects.find(p => p.id === id);
      set({ selectedProject: project || null, isLoading: false });
    } catch (error) {
      console.error('Error fetching project:', error);
      set({ isLoading: false });
    }
  },

  createProject: async (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name || 'Untitled Project',
      type: projectData.type || 'Contract',
      status: 'Draft',
      priority: projectData.priority || 'Medium',
      description: projectData.description,
      progress: 0,
      owner: projectData.owner!,
      team: projectData.team || [],
      documentCount: 0,
      tags: projectData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set(state => ({
      projects: [newProject, ...state.projects],
    }));

    return newProject.id;
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
      selectedProject: state.selectedProject?.id === id 
        ? { ...state.selectedProject, ...updates, updatedAt: new Date().toISOString() }
        : state.selectedProject,
    }));
  },

  deleteProject: async (id: string) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
    }));
  },

  setFilters: (filters: ProjectFilters) => {
    set({ filters });
    get().fetchProjects();
  },

  setSortOption: (sortOption: SortOption) => {
    set({ sortOption });
    get().fetchProjects();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchProjects();
  },
}));