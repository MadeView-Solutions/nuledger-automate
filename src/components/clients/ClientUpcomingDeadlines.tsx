import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { Client } from "@/types/client";

interface ClientUpcomingDeadlinesProps {
  client: Client;
}

interface Deadline {
  id: string;
  title: string;
  date: string;
  type: 'settlement' | 'disbursement' | 'court' | 'filing';
  urgency: 'low' | 'medium' | 'high';
}

const ClientUpcomingDeadlines: React.FC<ClientUpcomingDeadlinesProps> = ({ client }) => {
  // Generate deadlines based on settlement and case data
  const generateDeadlines = (): Deadline[] => {
    const deadlines: Deadline[] = [];
    
    if (client.caseInfo) {
      // Settlement-related deadlines
      if (!client.caseInfo.dateSettled) {
        deadlines.push({
          id: '1',
          title: 'Settlement Negotiation Review',
          date: getDateInDays(30),
          type: 'settlement',
          urgency: 'medium'
        });
        
        deadlines.push({
          id: '2',
          title: 'Case Status Update',
          date: getDateInDays(14),
          type: 'court',
          urgency: 'high'
        });
      } else {
        // Post-settlement deadlines
        deadlines.push({
          id: '3',
          title: 'Final Disbursement Processing',
          date: getDateInDays(7),
          type: 'disbursement',
          urgency: 'high'
        });
        
        deadlines.push({
          id: '4',
          title: 'Client Settlement Documentation',
          date: getDateInDays(21),
          type: 'filing',
          urgency: 'medium'
        });
      }
      
      // Generic case deadlines
      deadlines.push({
        id: '5',
        title: 'Quarterly Case Review',
        date: getDateInDays(45),
        type: 'court',
        urgency: 'low'
      });
    }
    
    return deadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getDateInDays = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const getDaysUntil = (dateStr: string): number => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (urgency: string, daysUntil: number) => {
    if (daysUntil <= 7) return 'destructive';
    if (urgency === 'high') return 'destructive';
    if (urgency === 'medium') return 'secondary';
    return 'outline';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'settlement':
        return <Calendar className="h-4 w-4" />;
      case 'disbursement':
        return <Clock className="h-4 w-4" />;
      case 'court':
        return <AlertTriangle className="h-4 w-4" />;
      case 'filing':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const deadlines = generateDeadlines();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deadlines.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No upcoming deadlines</p>
        ) : (
          <div className="space-y-3">
            {deadlines.map((deadline) => {
              const daysUntil = getDaysUntil(deadline.date);
              return (
                <div key={deadline.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground">
                      {getTypeIcon(deadline.type)}
                    </div>
                    <div>
                      <p className="font-medium">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(deadline.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getUrgencyColor(deadline.urgency, daysUntil)}>
                      {daysUntil <= 0 ? 'Overdue' : `${daysUntil} days`}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientUpcomingDeadlines;