import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  Circle, 
  PlayCircle,
  PauseCircle,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  BarChart3,
  Activity,
  Bot
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Mock data for demonstration
const mockSprints = [
  {
    id: "1",
    name: "Sprint 1 - User Authentication",
    description: "Implement user authentication and authorization system",
    status: "active" as const,
    start_date: "2024-01-15",
    end_date: "2024-01-29",
    goal: "Complete user authentication system with 2FA support",
    capacity: 40,
    velocity: 35,
    progress: 75,
    tasks: [
      { id: "1", title: "Setup authentication middleware", status: "done" as const, assignee: "John Doe", story_points: 5 },
      { id: "2", title: "Implement JWT tokens", status: "done" as const, assignee: "Jane Smith", story_points: 8 },
      { id: "3", title: "Add 2FA support", status: "in_progress" as const, assignee: "Mike Johnson", story_points: 13 },
      { id: "4", title: "Write authentication tests", status: "todo" as const, assignee: "Sarah Wilson", story_points: 8 },
      { id: "5", title: "Update documentation", status: "todo" as const, assignee: "John Doe", story_points: 3 }
    ]
  },
  {
    id: "2",
    name: "Sprint 2 - Dashboard Features",
    description: "Build core dashboard functionality and analytics",
    status: "planning" as const,
    start_date: "2024-01-30",
    end_date: "2024-02-13",
    goal: "Deliver comprehensive dashboard with real-time analytics",
    capacity: 50,
    velocity: 0,
    progress: 0,
    tasks: []
  }
];

const mockTeamMembers = [
  { id: "1", name: "John Doe", role: "scrum_master" as const, capacity: 40, availability: 100, skills: ["React", "Node.js", "Scrum"] },
  { id: "2", name: "Jane Smith", role: "developer" as const, capacity: 40, availability: 90, skills: ["TypeScript", "React", "Testing"] },
  { id: "3", name: "Mike Johnson", role: "developer" as const, capacity: 40, availability: 85, skills: ["Backend", "Database", "Security"] },
  { id: "4", name: "Sarah Wilson", role: "tester" as const, capacity: 30, availability: 95, skills: ["Testing", "QA", "Automation"] }
];

export default function SprintTaskPlanner() {
  const [selectedSprint, setSelectedSprint] = useState<string | null>(mockSprints[0].id);
  const [activeTab, setActiveTab] = useState("overview");

  const currentSprint = mockSprints.find(sprint => sprint.id === selectedSprint);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "planning": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "completed": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "done": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "in_progress": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "review": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "todo": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle className="h-4 w-4" />;
      case "in_progress": return <PlayCircle className="h-4 w-4" />;
      case "review": return <PauseCircle className="h-4 w-4" />;
      case "todo": return <Circle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">OpsCrew.ai</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-lg font-medium">Sprint & Task Planner</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Sprint
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Sprint Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Sprint Management</h1>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sprints..."
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>

          {/* Sprint Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSprints.map((sprint, index) => (
              <motion.div
                key={sprint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedSprint === sprint.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedSprint(sprint.id)}
              >
                <Card className="card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{sprint.name}</CardTitle>
                        <CardDescription className="text-sm mb-3">
                          {sprint.description}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(sprint.status)}>
                        {sprint.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{sprint.progress}%</span>
                      </div>
                      <Progress value={sprint.progress} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(sprint.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {sprint.capacity} pts
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Velocity</span>
                        <span className="font-medium">{sprint.velocity}/{sprint.capacity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        {currentSprint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sprint Details */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{currentSprint.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(currentSprint.status)}>
                              {currentSprint.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>{currentSprint.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Start Date</span>
                            </div>
                            <p className="font-medium">
                              {new Date(currentSprint.start_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>End Date</span>
                            </div>
                            <p className="font-medium">
                              {new Date(currentSprint.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Target className="h-4 w-4" />
                              <span>Capacity</span>
                            </div>
                            <p className="font-medium">{currentSprint.capacity} story points</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Sprint Goal</span>
                          </div>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">
                            {currentSprint.goal}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{currentSprint.progress}%</span>
                          </div>
                          <Progress value={currentSprint.progress} className="h-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Sprint Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Tasks</span>
                          <span className="font-medium">{currentSprint.tasks.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Completed</span>
                          <span className="font-medium text-green-600">
                            {currentSprint.tasks.filter(task => task.status === 'done').length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">In Progress</span>
                          <span className="font-medium text-blue-600">
                            {currentSprint.tasks.filter(task => task.status === 'in_progress').length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Remaining</span>
                          <span className="font-medium text-gray-600">
                            {currentSprint.tasks.filter(task => task.status === 'todo').length}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Team Capacity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {mockTeamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {member.role.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{member.capacity}h</p>
                              <p className="text-xs text-muted-foreground">
                                {member.availability}% available
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Tasks</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentSprint.tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="card-hover">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                            <Badge className={getTaskStatusColor(task.status)}>
                              {getTaskStatusIcon(task.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Assignee</span>
                              <span className="font-medium">{task.assignee}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Story Points</span>
                              <span className="font-medium">{task.story_points}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Button variant="outline" size="sm" className="flex-1 mr-2">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                Move
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Team Members</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockTeamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="card-hover">
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-lg font-medium text-primary">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{member.name}</CardTitle>
                              <CardDescription className="capitalize">
                                {member.role.replace('_', ' ')}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Capacity</span>
                              <span className="font-medium">{member.capacity}h/sprint</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Availability</span>
                              <span className="font-medium">{member.availability}%</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              View Tasks
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Sprint Analytics</h2>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Real-time
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Velocity Trend</CardTitle>
                      <CardDescription>Story points completed per sprint</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                          <p>Velocity chart will be displayed here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Burndown Chart</CardTitle>
                      <CardDescription>Remaining work over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Activity className="h-12 w-12 mx-auto mb-2" />
                          <p>Burndown chart will be displayed here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Task Distribution</CardTitle>
                      <CardDescription>Tasks by status and priority</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">To Do</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-gray-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                            <span className="text-sm font-medium">3</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">In Progress</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                            <span className="text-sm font-medium">1</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Done</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                            <span className="text-sm font-medium">2</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Team Performance</CardTitle>
                      <CardDescription>Individual contributions and capacity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockTeamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-sm font-medium">{member.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${member.availability}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{member.availability}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
