
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";
import { accountingPlatforms } from "./AccountingPlatforms";
import { AccountingPlatform, CustomPlatform } from "./AccountingPlatformTypes";
import { useToast } from "@/components/ui/use-toast";

interface PlatformSelectorProps {
  selectedPlatform: string;
  customPlatforms: CustomPlatform[];
  onPlatformChange: (value: string) => void;
  onAddCustomPlatform: (name: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  customPlatforms,
  onPlatformChange,
  onAddCustomPlatform,
}) => {
  const { toast } = useToast();
  const [isAddingPlatform, setIsAddingPlatform] = React.useState(false);
  const [newPlatformName, setNewPlatformName] = React.useState("");

  const handlePlatformChange = (value: string) => {
    onPlatformChange(value);
    
    if (value !== "quickbooks" && !value.startsWith('custom-')) {
      toast({
        title: `${accountingPlatforms.find(p => p.id === value)?.name || 
                customPlatforms.find(p => p.id === value)?.name} Integration`,
        description: "This integration is coming soon. Currently only QuickBooks Online is fully supported.",
        variant: "default",
      });
    }
  };

  const handleAddCustomPlatform = () => {
    if (newPlatformName.trim()) {
      onAddCustomPlatform(newPlatformName.trim());
      setNewPlatformName("");
      setIsAddingPlatform(false);
    }
  };

  return (
    <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select platform" />
      </SelectTrigger>
      <SelectContent>
        {accountingPlatforms.map(platform => (
          <SelectItem key={platform.id} value={platform.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <platform.logo />
              <span>{platform.name}</span>
              {!platform.available && (
                <span className="text-xs ml-2 text-muted-foreground">(Coming Soon)</span>
              )}
            </div>
          </SelectItem>
        ))}
        
        {customPlatforms.map(platform => (
          <SelectItem key={platform.id} value={platform.id}>
            <div className="flex items-center gap-2">
              <span>{platform.name}</span>
              <span className="text-xs ml-2 text-muted-foreground">(Custom)</span>
            </div>
          </SelectItem>
        ))}
        
        <div className="px-2 py-1.5">
          <Popover open={isAddingPlatform} onOpenChange={setIsAddingPlatform}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sm font-normal"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add custom platform
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Add Custom Platform</h4>
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input 
                    id="platform-name" 
                    value={newPlatformName}
                    onChange={(e) => setNewPlatformName(e.target.value)}
                    placeholder="Enter platform name"
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={handleAddCustomPlatform}
                  disabled={!newPlatformName.trim()}
                >
                  Add Platform
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </SelectContent>
    </Select>
  );
};

export default PlatformSelector;
