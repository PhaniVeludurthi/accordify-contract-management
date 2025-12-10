import { create } from 'zustand';
import type { Document, DocumentFilters, SortOption, Comment } from '@/types';
import { mockDocuments } from '@/services/mockData';

interface DocumentStore {
  documents: Document[];
  selectedDocument: Document | null;
  comments: Comment[];
  filters: DocumentFilters;
  sortOption: SortOption;
  isLoading: boolean;
  
  fetchDocuments: () => Promise<void>;
  fetchDocumentById: (id: string) => Promise<void>;
  uploadDocument: (document: Partial<Document>) => Promise<string>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  fetchComments: (documentId: string) => Promise<void>;
  addComment: (documentId: string, text: string) => Promise<void>;
  setFilters: (filters: DocumentFilters) => void;
  setSortOption: (sortOption: SortOption) => void;
  clearFilters: () => void;
}

export const useDocumentStore = create<DocumentStore>()((set, get) => ({
  documents: [],
  selectedDocument: null,
  comments: [],
  filters: {},
  sortOption: { field: 'uploadedAt', direction: 'desc' },
  isLoading: false,

  fetchDocuments: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let documents = [...mockDocuments];
      const { filters, sortOption } = get();

      // Apply filters
      if (filters.type && filters.type.length > 0) {
        documents = documents.filter(d => filters.type!.includes(d.type));
      }
      if (filters.status && filters.status.length > 0) {
        documents = documents.filter(d => filters.status!.includes(d.status));
      }
      if (filters.projectId) {
        documents = documents.filter(d => d.projectId === filters.projectId);
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        documents = documents.filter(d => 
          d.name.toLowerCase().includes(query) ||
          d.projectName.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      documents.sort((a, b) => {
        const aVal = a[sortOption.field as keyof Document];
        const bVal = b[sortOption.field as keyof Document];
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOption.direction === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        return 0;
      });

      set({ documents, isLoading: false });
    } catch (error) {
      console.error('Error fetching documents:', error);
      set({ isLoading: false });
    }
  },

  fetchDocumentById: async (id: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const document = mockDocuments.find(d => d.id === id);
      set({ selectedDocument: document || null, isLoading: false });
    } catch (error) {
      console.error('Error fetching document:', error);
      set({ isLoading: false });
    }
  },

  uploadDocument: async (documentData: Partial<Document>) => {
    const newDocument: Document = {
      id: Date.now().toString(),
      name: documentData.name || 'Untitled Document',
      type: documentData.type || 'Other',
      status: 'Draft',
      projectId: documentData.projectId!,
      projectName: documentData.projectName || '',
      fileSize: documentData.fileSize || 0,
      mimeType: documentData.mimeType || 'application/pdf',
      uploadedBy: documentData.uploadedBy!,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiAnalysisStatus: 'Not Started',
      tags: documentData.tags || [],
      version: 1,
    };

    set(state => ({
      documents: [newDocument, ...state.documents],
    }));

    return newDocument.id;
  },

  updateDocument: async (id: string, updates: Partial<Document>) => {
    set(state => ({
      documents: state.documents.map(d => 
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
      selectedDocument: state.selectedDocument?.id === id 
        ? { ...state.selectedDocument, ...updates, updatedAt: new Date().toISOString() }
        : state.selectedDocument,
    }));
  },

  deleteDocument: async (id: string) => {
    set(state => ({
      documents: state.documents.filter(d => d.id !== id),
    }));
  },

  fetchComments: async (documentId: string) => {
    // Mock comments - replace with actual API call
    const mockComments: Comment[] = [];
    set({ comments: mockComments });
  },

  addComment: async (_documentId: string, _text: string) => {
    // Mock add comment - replace with actual API call
  },

  setFilters: (filters: DocumentFilters) => {
    set({ filters });
    get().fetchDocuments();
  },

  setSortOption: (sortOption: SortOption) => {
    set({ sortOption });
    get().fetchDocuments();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchDocuments();
  },
}));