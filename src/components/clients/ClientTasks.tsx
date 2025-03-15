import React from 'react';
import { Calendar, CheckCircle2, CheckSquare, Clock, Flag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client, ClientTask } from '@/types/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ClientTasksProps {
  client: Client;
}

const ClientTasks: React.FC<ClientTasksProps> = ({ client }) => {
  const tasks = client.tasks || [];
  
  // Group tasks by status
  const groupedTasks: Record<string, ClientTask[]> = {
    pending: tasks.filter(task => task.status === 'pending'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed'),
    overdue: tasks.filter(task => task.status === 'overdue'),
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client Tasks</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
      
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-sm flex items-center mb-3">
                <CheckSquare className="h-4 w-4 mr-1.5 text-muted-foreground" />
                Open Tasks
              </h4>
              <div className="space-y-3">
                {groupedTasks['pending'].length > 0 ? (
                  groupedTasks['pending'].map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No pending tasks</p>
                )}
                
                {groupedTasks['in-progress'].length > 0 && (
                  groupedTasks['in-progress'].map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                )}
                
                {groupedTasks['overdue'].length > 0 && (
                  groupedTasks['overdue'].map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-sm flex items-center mb-3">
                <CheckCircle2 className="h-4 w-4 mr-1.5 text-muted-foreground" />
                Completed Tasks
              </h4>
              <div className="space-y-3">
                {groupedTasks['completed'].length > 0 ? (
                  groupedTasks['completed'].map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No completed tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <CheckSquare className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No Tasks</h3>
            <p className="text-center text-muted-foreground mb-4">
              No tasks have been created for this client yet.
            </p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Create First Task
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-muted/50 rounded-md p-4">
        <h4 className="font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-1.5" />
          Upcoming Deadlines
        </h4>
        <div className="mt-3 space-y-3">
          <DeadlineItem 
            title="Quarterly Tax Filing"
            date={getQuarterlyDate()}
            days={getDaysUntil(getQuarterlyDate())}
          />
          <DeadlineItem 
            title="Annual Compliance Review"
            date={getAnnualDate()}
            days={getDaysUntil(getAnnualDate())}
          />
        </div>
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: ClientTask;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div className={cn(
      "flex items-start rounded-md p-2",
      task.status === 'overdue' && "bg-red-50/50",
      task.status === 'in-progress' && "bg-blue-50/50",
      task.status === 'completed' && "bg-green-50/50"
    )}>
      <div className={cn(
        "h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5",
        task.status === 'completed' 
          ? "bg-green-100 text-green-700" 
          : task.status === 'overdue'
            ? "bg-red-100 text-red-700"
            : task.priority === 'high'
              ? "bg-amber-100 text-amber-700"
              : "bg-blue-100 text-blue-700"
      )}>
        {task.status === 'completed' ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : task.status === 'overdue' ? (
          <Clock className="h-3.5 w-3.5" />
        ) : (
          <Flag className="h-3.5 w-3.5" />
        )}
      </div>
      <div className="flex-1">
        <h5 className="text-sm font-medium">{task.title}</h5>
        <p className="text-xs text-muted-foreground">{task.description}</p>
        <div className="flex items-center mt-1 space-x-2">
          <span className="text-xs text-muted-foreground">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </div>
    </div>
  );
};

interface DeadlineItemProps {
  title: string;
  date: string;
  days: number;
}

const DeadlineItem: React.FC<DeadlineItemProps> = ({ title, date, days }) => {
  return (
    <div className="flex items-center justify-between bg-background rounded-md p-3">
      <div>
        <h5 className="font-medium text-sm">{title}</h5>
        <p className="text-xs text-muted-foreground">Due: {date}</p>
      </div>
      <Badge variant={days < 15 ? "default" : "outline"} className={cn(
        days < 15 && "bg-amber-500"
      )}>
        {days} days left
      </Badge>
    </div>
  );
};

const PriorityBadge = ({ priority }: { priority: ClientTask['priority'] }) => {
  if (priority === 'high') {
    return <Badge variant="outline" className="text-xs border-red-200 text-red-700">High</Badge>;
  } else if (priority === 'medium') {
    return <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">Medium</Badge>;
  } else {
    return <Badge variant="outline" className="text-xs border-gray-200 text-gray-700">Low</Badge>;
  }
};

const StatusBadge = ({ status }: { status: ClientTask['status'] }) => {
  if (status === 'completed') {
    return <Badge className="text-xs bg-green-500">Completed</Badge>;
  } else if (status === 'in-progress') {
    return <Badge className="text-xs bg-blue-500">In Progress</Badge>;
  } else if (status === 'overdue') {
    return <Badge className="text-xs bg-red-500">Overdue</Badge>;
  } else {
    return <Badge variant="outline" className="text-xs">Pending</Badge>;
  }
};

// Helper functions to generate dates for demo purposes
const getQuarterlyDate = () => {
  const date = new Date();
  const currentMonth = date.getMonth();
  // Set to end of quarter
  if (currentMonth < 3) date.setMonth(3);
  else if (currentMonth < 6) date.setMonth(6);
  else if (currentMonth < 9) date.setMonth(9);
  else {
    date.setMonth(0);
    date.setFullYear(date.getFullYear() + 1);
  }
  date.setDate(15);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getAnnualDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 6);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getDaysUntil = (dateStr: string): number => {
  const future = new Date(dateStr);
  const now = new Date();
  const diffTime = future.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default ClientTasks;
