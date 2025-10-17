import { motion } from 'motion/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  MessageSquare, 
  Plus, 
  Search, 
  Settings,
  Video,
  Mail,
  Sparkles
} from 'lucide-react';
import { 
  MeetingCard, 
  MeetingSummaryCard, 
  CommunicationWidget 
} from '@/components/meetings-comms';
import { 
  useMeetings, 
  useUpcomingMeetings, 
  useStartMeeting,
  useEndMeeting,
  useJoinMeeting,
  useGenerateMeetingSummary
} from '@/hooks/use-meetings';
import { 
  useCommunications, 
  useUnreadCommunications,
  useSendCommunication,
  useMarkAsRead
} from '@/hooks/use-communications';
import { useToast } from '@/hooks/use-toast';
import type { Meeting, Communication } from '@/types';

// Mock data for demonstration
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Daily Standup',
    description: 'Daily team standup to discuss progress and blockers',
    project_id: 'proj-1',
    meeting_type: 'standup',
    status: 'scheduled',
    start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    end_time: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
    duration: 30,
    participants: [
      { id: '1', user_id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'organizer', status: 'accepted' },
      { id: '2', user_id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'attendee', status: 'accepted' },
      { id: '3', user_id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', role: 'attendee', status: 'tentative' }
    ],
    agenda: ['Review yesterday\'s progress', 'Discuss today\'s tasks', 'Identify blockers'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: '2',
    title: 'Sprint Planning',
    description: 'Plan the next sprint with the development team',
    project_id: 'proj-1',
    meeting_type: 'sprint_planning',
    status: 'in_progress',
    start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    end_time: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    participants: [
      { id: '1', user_id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'organizer', status: 'accepted' },
      { id: '2', user_id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'attendee', status: 'accepted' },
      { id: '3', user_id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', role: 'attendee', status: 'accepted' },
      { id: '4', user_id: 'user-4', name: 'Alice Brown', email: 'alice@example.com', role: 'attendee', status: 'accepted' }
    ],
    agenda: ['Review backlog', 'Estimate stories', 'Plan sprint goals'],
    meeting_url: 'https://zoom.us/j/123456789',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'user-1'
  },
  {
    id: '3',
    title: 'Client Check-in',
    description: 'Weekly check-in with the client to discuss progress',
    project_id: 'proj-1',
    meeting_type: 'client_call',
    status: 'completed',
    start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    end_time: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    duration: 30,
    participants: [
      { id: '1', user_id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'organizer', status: 'accepted' },
      { id: '5', user_id: 'user-5', name: 'Client Rep', email: 'client@example.com', role: 'attendee', status: 'accepted' }
    ],
    agenda: ['Project status update', 'Demo new features', 'Q&A session'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'user-1'
  }
];

const mockCommunications: Communication[] = [
  {
    id: '1',
    type: 'email',
    channel: 'general',
    project_id: 'proj-1',
    sender_id: 'user-1',
    sender_name: 'John Doe',
    recipient_id: 'user-2',
    recipient_name: 'Jane Smith',
    subject: 'Sprint Planning Meeting Notes',
    content: 'Here are the key decisions from today\'s sprint planning meeting...',
    status: 'sent',
    priority: 'medium',
    sent_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    type: 'slack',
    channel: 'dev-team',
    project_id: 'proj-1',
    sender_id: 'user-1',
    sender_name: 'John Doe',
    subject: 'Daily Standup Reminder',
    content: 'Don\'t forget about our daily standup at 9 AM tomorrow!',
    status: 'delivered',
    priority: 'low',
    sent_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    type: 'email',
    channel: 'general',
    project_id: 'proj-1',
    sender_id: 'user-1',
    sender_name: 'John Doe',
    recipient_id: 'user-5',
    recipient_name: 'Client Rep',
    subject: 'Project Update - Week 3',
    content: 'I wanted to provide you with an update on our progress...',
    status: 'draft',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function MeetingsComms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { toast } = useToast();

  // Mock hooks - in real implementation, these would use actual API calls
  const { data: meetings = mockMeetings } = useMeetings();
  const { data: upcomingMeetings = mockMeetings.filter(m => m.status === 'scheduled') } = useUpcomingMeetings();
  const { data: communications = mockCommunications } = useCommunications();
  const { data: unreadCommunications = mockCommunications.filter(c => c.status === 'draft') } = useUnreadCommunications();

  const startMeeting = useStartMeeting();
  const endMeeting = useEndMeeting();
  const joinMeeting = useJoinMeeting();
  const generateSummary = useGenerateMeetingSummary();
  const sendCommunication = useSendCommunication();
  const markAsRead = useMarkAsRead();

  const handleJoinMeeting = async (meeting: Meeting) => {
    try {
      const result = await joinMeeting.mutateAsync(meeting.id);
      if (result.meeting_url) {
        window.open(result.meeting_url, '_blank');
      }
      toast({
        title: 'Joining meeting...',
        description: 'Opening meeting in new tab.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join meeting. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStartMeeting = async (meeting: Meeting) => {
    try {
      await startMeeting.mutateAsync(meeting.id);
      toast({
        title: 'Meeting started',
        description: 'The meeting has been started successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start meeting. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEndMeeting = async (meeting: Meeting) => {
    try {
      await endMeeting.mutateAsync({ id: meeting.id, notes: '' });
      toast({
        title: 'Meeting ended',
        description: 'The meeting has been ended successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to end meeting. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateSummary = async (meetingId: string) => {
    try {
      await generateSummary.mutateAsync(meetingId);
      toast({
        title: 'Generating summary...',
        description: 'AI is analyzing the meeting and generating a summary.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSendCommunication = async (communication: Communication) => {
    try {
      await sendCommunication.mutateAsync(communication.id);
      toast({
        title: 'Message sent',
        description: 'Your communication has been sent successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send communication. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsRead = async (communication: Communication) => {
    try {
      await markAsRead.mutateAsync(communication.id);
      toast({
        title: 'Marked as read',
        description: 'Communication has been marked as read.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark as read. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === 'all' || meeting.project_id === selectedProject;
    const matchesType = selectedType === 'all' || meeting.meeting_type === selectedType;
    return matchesSearch && matchesProject && matchesType;
  });

  const filteredCommunications = communications.filter(communication => {
    const matchesSearch = communication.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         communication.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === 'all' || communication.project_id === selectedProject;
    const matchesType = selectedType === 'all' || communication.type === selectedType;
    return matchesSearch && matchesProject && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Meetings & Communications</h1>
                <p className="text-muted-foreground">Manage meetings and team communications</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Meeting
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{meetings.length}</div>
                <p className="text-xs text-muted-foreground">
                  {upcomingMeetings.length} upcoming
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                <Mail className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{communications.filter(c => c.status === 'sent').length}</div>
                <p className="text-xs text-muted-foreground">
                  {unreadCommunications.length} unread
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Meetings</CardTitle>
                <Video className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{meetings.filter(m => m.status === 'in_progress').length}</div>
                <p className="text-xs text-muted-foreground">
                  In progress now
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Summaries</CardTitle>
                <Sparkles className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Generated this week
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="meetings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter meetings by project, type, and search terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search meetings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="proj-1">Project Alpha</SelectItem>
                      <SelectItem value="proj-2">Project Beta</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="standup">Standup</SelectItem>
                      <SelectItem value="sprint_planning">Sprint Planning</SelectItem>
                      <SelectItem value="retrospective">Retrospective</SelectItem>
                      <SelectItem value="client_call">Client Call</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Meetings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <MeetingCard
                    meeting={meeting}
                    onJoin={handleJoinMeeting}
                    onStart={handleStartMeeting}
                    onEnd={handleEndMeeting}
                  />
                </motion.div>
              ))}
            </div>

            {/* Meeting Summary Cards */}
            {meetings.filter(m => m.status === 'completed').length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Meeting Summaries</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {meetings.filter(m => m.status === 'completed').slice(0, 2).map((meeting, index) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <MeetingSummaryCard
                        summary={{
                          id: `summary-${meeting.id}`,
                          meeting_id: meeting.id,
                          status: 'completed',
                          key_points: [
                            'Discussed project timeline and deliverables',
                            'Identified key blockers and dependencies',
                            'Agreed on next sprint priorities'
                          ],
                          action_items: [],
                          decisions: [],
                          next_steps: [
                            'Complete user story refinement',
                            'Set up development environment',
                            'Schedule client review meeting'
                          ],
                          sentiment: 'positive',
                          confidence_score: 85,
                          generated_at: new Date().toISOString(),
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString()
                        }}
                        onGenerate={() => handleGenerateSummary(meeting.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter communications by project, type, and search terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search communications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="proj-1">Project Alpha</SelectItem>
                      <SelectItem value="proj-2">Project Beta</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="teams">Teams</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Communications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCommunications.map((communication, index) => (
                <motion.div
                  key={communication.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CommunicationWidget
                    communication={communication}
                    onSend={handleSendCommunication}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
