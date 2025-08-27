import React from "react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CreatorCard } from "./CreatorCard";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Creator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tagline: string;
  followers: number;
  platform: string;
  topics: string[];
  style: string;
}

export function CreatorDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  // Mock creators data
  const creators: Creator[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Engineer',
      avatar: 'https://images.unsplash.com/photo-1602566356438-dd36d35e989c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFuJTIwdGVjaHxlbnwxfHx8fDE3NTYwODk4MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      tagline: 'Building scalable systems at scale. Sharing practical engineering tips.',
      followers: 85000,
      platform: 'LinkedIn',
      topics: ['Engineering', 'System Design'],
      style: 'Professional'
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1680540692052-79fde1108370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbiUyMGRldmVsb3BlcnxlbnwxfHx8fDE3NTYwODk4MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      tagline: 'From zero to PM. Helping others break into product management.',
      followers: 45000,
      platform: 'YouTube',
      topics: ['Product', 'Career'],
      style: 'Educational'
    },
    {
      id: '3',
      name: 'Alex Rodriguez',
      role: 'Designer',
      avatar: 'https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc1NjA4OTgxNXww&ixlib=rb-4.1.0&q=80&w=1080',
      tagline: 'Design thinking meets business strategy. Unhinged design hacks.',
      followers: 32000,
      platform: 'Instagram',
      topics: ['Design', 'UX'],
      style: 'Creative'
    },
    {
      id: '4',
      name: 'Emily Zhang',
      role: 'Data Scientist',
      avatar: 'https://images.unsplash.com/photo-1594736797933-d0e501ba2fe6?w=400',
      tagline: 'Making data science accessible. Python tips and career advice.',
      followers: 28000,
      platform: 'LinkedIn',
      topics: ['Data Science', 'Python'],
      style: 'Educational'
    },
    {
      id: '5',
      name: 'David Kim',
      role: 'Founder',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      tagline: 'Built 3 startups. Sharing lessons learned the hard way.',
      followers: 67000,
      platform: 'Twitter',
      topics: ['Entrepreneurship', 'Startups'],
      style: 'Inspiring'
    },
    {
      id: '6',
      name: 'Lisa Park',
      role: 'Designer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      tagline: 'From bootcamp to FAANG. UI/UX design career journey.',
      followers: 24000,
      platform: 'YouTube',
      topics: ['Design', 'Career'],
      style: 'Inspiring'
    }
  ];

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !selectedRole || creator.role === selectedRole;
    const matchesTopic = !selectedTopic || creator.topics.includes(selectedTopic);
    const matchesStyle = !selectedStyle || creator.style === selectedStyle;

    return matchesSearch && matchesRole && matchesTopic && matchesStyle;
  });

  const clearFilters = () => {
    setSelectedRole("");
    setSelectedTopic("");
    setSelectedStyle("");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Creator Database
          </h1>
          <p className="text-gray-600">
            Browse all {creators.length} creators in our curated database
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineer">Engineer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  <SelectItem value="Founder">Founder</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Educational">Educational</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                  <SelectItem value="Inspiring">Inspiring</SelectItem>
                </SelectContent>
              </Select>

              {(selectedRole || selectedTopic || selectedStyle || searchQuery) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-600"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {(selectedRole || selectedTopic || selectedStyle) && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedRole && (
                  <Badge variant="secondary" className="bg-primary/5 text-primary">
                    Role: {selectedRole}
                  </Badge>
                )}
                {selectedTopic && (
                  <Badge variant="secondary" className="bg-primary/5 text-primary">
                    Topic: {selectedTopic}
                  </Badge>
                )}
                {selectedStyle && (
                  <Badge variant="secondary" className="bg-primary/5 text-primary">
                    Style: {selectedStyle}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredCreators.length} Creator{filteredCreators.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          {filteredCreators.length > 0 ? (
            <div className="grid gap-4">
              {filteredCreators.map((creator) => (
                <CreatorCard
                  creator={creator}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No creators found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}