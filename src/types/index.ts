// User and Authentication Types
export type UserRole = 
  | 'Administrator' 
  | 'Collaborator' 
  | 'Viewer' 
  | 'Approver' 
  | 'Legal Reviewer' 
  | 'Finance Approver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Project Types
export type ProjectType = 'Contract' | 'RFQ' | 'RFP' | 'Solicitation' | 'Agreement' | 'Other';
export type ProjectStatus = 'Draft' | 'Active' | 'In Review' | 'Completed' | 'Archived';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  description?: string;
  dueDate?: string;
  progress: number;
  owner: User;
  team: TeamMember[];
  documentCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  user: User;
  role: 'Owner' | 'Editor' | 'Reviewer' | 'Viewer';
  addedAt: string;
}

// Document Types
export type DocumentType = 
  | 'Contract' 
  | 'Amendment' 
  | 'RFQ' 
  | 'RFP' 
  | 'Solicitation' 
  | 'Agreement'
  | 'Report'
  | 'Other';

export type DocumentStatus = 'Draft' | 'Active' | 'In Review' | 'Approved' | 'Expired' | 'Terminated';
export type AIAnalysisStatus = 'Not Started' | 'Pending' | 'Analyzing' | 'Complete' | 'Failed';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  projectId: string;
  projectName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: User;
  uploadedAt: string;
  updatedAt: string;
  aiAnalysisStatus: AIAnalysisStatus;
  tags: string[];
  version: number;
}

export interface DocumentVersion {
  id: string;
  version: number;
  createdBy: User;
  createdAt: string;
  changes: string;
  fileUrl: string;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
  updatedAt?: string;
  isResolved: boolean;
  replies: Comment[];
  documentSection?: string;
}

// AI Analysis Types
export interface AIAnalysis {
  id: string;
  documentId: string;
  status: AIAnalysisStatus;
  completedAt?: string;
  keyInformation: KeyValuePair[];
  identifiedClauses: Clause[];
  dates: DateItem[];
  parties: Party[];
  financialTerms: FinancialTerm[];
  risks: Risk[];
  recommendations: string[];
}

export interface KeyValuePair {
  key: string;
  value: string;
  confidence: number;
}

export interface Party {
  name: string;
  role: string;
  contact?: string;
}

export interface DateItem {
  label: string;
  date: string;
  type: 'start' | 'end' | 'renewal' | 'deadline' | 'other';
}

export interface FinancialTerm {
  description: string;
  amount: number;
  currency: string;
  type: 'payment' | 'penalty' | 'bonus' | 'other';
}

export interface Risk {
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
}

// Clause Types
export interface Clause {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdBy: User;
  createdAt: string;
  usageCount: number;
  lastUsed?: string;
}

export interface ClauseCategory {
  id: string;
  name: string;
  description?: string;
  clauseCount: number;
}

// Workflow Types
export type WorkflowStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Rejected' | 'Stalled';
export type ApprovalAction = 'Approve' | 'Reject' | 'Request Changes';

export interface Workflow {
  id: string;
  projectId: string;
  documentId?: string;
  status: WorkflowStatus;
  currentStage: number;
  stages: WorkflowStage[];
  startedAt: string;
  completedAt?: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  approver: User;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Not Started';
  approvedAt?: string;
  comments?: string;
  isRequired: boolean;
}

export interface Approval {
  id: string;
  documentId: string;
  documentName: string;
  projectId: string;
  projectName: string;
  submittedBy: User;
  submittedAt: string;
  dueDate?: string;
  priority: ProjectPriority;
  currentApprover: User;
  previousApprovers: User[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

// Action Types
export type ActionCategory = 'Renewal' | 'Amendment' | 'Compliance' | 'Payment' | 'Custom';
export type ActionStatus = 'Pending' | 'In Progress' | 'Completed' | 'Dismissed';

export interface Action {
  id: string;
  category: ActionCategory;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  dueDate?: string;
  priority: ProjectPriority;
  status: ActionStatus;
  assignedTo?: User;
  createdAt: string;
  aiRecommendation?: string;
}

export interface RenewalAction extends Action {
  category: 'Renewal';
  contractEndDate: string;
  renewalType: 'Auto-renew' | 'Manual' | 'Negotiation required';
  daysUntilRenewal: number;
}

export interface ComplianceAction extends Action {
  category: 'Compliance';
  complianceType: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

// Notification Types
export type NotificationType = 
  | 'approval_request'
  | 'approval_completed'
  | 'document_shared'
  | 'comment_mention'
  | 'deadline_approaching'
  | 'compliance_alert'
  | 'system_announcement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// Report Types
export interface MetricCard {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

// Activity Types
export interface Activity {
  id: string;
  type: string;
  description: string;
  user: User;
  timestamp: string;
  projectId?: string;
  documentId?: string;
  metadata?: Record<string, unknown>;
}

// Filter and Sort Types
export interface ProjectFilters {
  status?: ProjectStatus[];
  type?: ProjectType[];
  priority?: ProjectPriority[];
  owner?: string;
  dateRange?: { start: string; end: string };
  searchQuery?: string;
}

export interface DocumentFilters {
  type?: DocumentType[];
  status?: DocumentStatus[];
  projectId?: string;
  tags?: string[];
  dateRange?: { start: string; end: string };
  searchQuery?: string;
}

export type SortOption = {
  field: string;
  direction: 'asc' | 'desc';
};

// Pagination Types
export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// Settings Types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: {
    approvals: boolean;
    documents: boolean;
    comments: boolean;
    deadlines: boolean;
    announcements: boolean;
  };
  inApp: {
    approvals: boolean;
    documents: boolean;
    comments: boolean;
    deadlines: boolean;
    announcements: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
}