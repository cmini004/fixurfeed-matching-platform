import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CreatorCard } from "./CreatorCard";
import { Search, Filter, Loader2 } from "lucide-react";
import { creatorApi, type Creator } from "../services/creatorApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function CreatorDatabase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load creators from API
  useEffect(() => {
    const loadCreators = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCreators = await creatorApi.getAllCreators();
        setCreators(fetchedCreators);
      } catch (err) {
        console.error('Error loading creators:', err);
        setError('Failed to load creators. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCreators();
  }, []);

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (creator.tagline && creator.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (creator.knownFor && creator.knownFor.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = !selectedRole || creator.role === selectedRole;
    const matchesTopic = !selectedTopic || creator.topics.includes(selectedTopic);
    const matchesStyle = !selectedStyle || creator.contentStyle?.includes(selectedStyle);

    return matchesSearch && matchesRole && matchesTopic && matchesStyle;
  });

  const clearFilters = () => {
    setSelectedRole("");
    setSelectedTopic("");
    setSelectedStyle("");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Creator Database...
          </h2>
          <p className="text-gray-600">
            Fetching the latest creator profiles
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Search className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Creators
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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