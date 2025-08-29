import { creatorApi, type Creator } from '../services/creatorApi';


interface QuizResponse {
  age: string;
  gender: string;
  ethnicity: string[];
  careerJourney: string[];
  goals: string[];
  contentCare: string[];
  contentPreference: string[];
}

interface MatchedCreator extends Creator {
  matchReason: string;
  cta: string;
  tags: string[];
}

export async function matchCreators(userResponses: QuizResponse): Promise<MatchedCreator[]> {
  const creators = await creatorApi.getAllCreators();
  
  // Helper function to check if creator matches identity
  const matchesIdentity = (creator: Creator): boolean => {
    let userGender = userResponses.gender;
    
    // If gender was skipped, randomly assign one for "someone who looks like me" matching
    if (!userGender || userGender === '') {
      const genders = ['Woman', 'Man', 'Other'];
      userGender = genders[Math.floor(Math.random() * genders.length)];
    }
    
    // Map user gender to creator gender
    const genderMap: Record<string, string[]> = {
      'Woman': ['Female'],
      'Man': ['Male'],
      'Other': ['Other', 'Transgender', 'Genderfluid', 'Non-binary', 'Nonbinary']
    };
    
    const matchingGenders = genderMap[userGender] || [];
    if (matchingGenders.some(g => creator.gender.toLowerCase().includes(g.toLowerCase()))) {
      return true;
    }
    
    if (userResponses.ethnicity && userResponses.ethnicity.length > 0) {
      // Check ethnicity match - handle Latino/Hispanic mapping
      const ethnicityMap: Record<string, string[]> = {
        'Latino / Hispanic': ['Latino', 'Hispanic', 'Latine'],
        'Asian': ['Asian'],
        'Black / African American': ['Black', 'African American'],
        'White / Caucasian': ['White', 'Caucasian'],
        'Middle Eastern / North African': ['Middle Eastern', 'North African', 'MENA'],
        'Native American / Indigenous': ['Native American', 'Indigenous'],
        'Pacific Islander': ['Pacific Islander'],
        'Mixed / Multiracial': ['Mixed', 'Multiracial', 'Biracial'],
        'Other': ['Other']
      };
      
      return userResponses.ethnicity.some(userEth => {
        const matchingEthnicities = ethnicityMap[userEth] || [userEth];
        return matchingEthnicities.some(e => 
            creator.ethnicity.toLowerCase().includes(e.toLowerCase()) ||
            e.toLowerCase().includes(creator.ethnicity.toLowerCase())
        );
      });
    }
    
    return false;
  };
  
  // Helper function to check if creator matches career goals using actual data structure
  const matchesGoals = (creator: Creator): boolean => {
    return userResponses.goals.some(goal => {
      const goalMap: Record<string, { exact: string[], partial: string[], roleKeywords: string[] }> = {
        'Marketing in tech': {
          exact: ['Digital Marketing', 'Content strategy'], // Exact subCategory matches
          partial: ['marketing', 'brand', 'growth'],
          roleKeywords: ['marketing', 'brand', 'marketer']
        },
        'Product management': {
          exact: ['Product Management'], // Exact subCategory match
          partial: ['product manager', 'pm', 'product'],
          roleKeywords: ['product manager', 'product', 'pm']
        },
        'Entrepreneurship': {
          exact: ['Founders, startup advice', 'fundraising and pitching'],
          partial: ['entrepreneur', 'founder', 'startup', 'ceo'],
          roleKeywords: ['founder', 'entrepreneur', 'ceo']
        },
        'Data science': {
          exact: ['Data Science', 'AI/ML'],
          partial: ['data science', 'machine learning', 'ai', 'analytics'],
          roleKeywords: ['data scientist', 'data', 'ai', 'ml']
        },
        'Software engineering': {
          exact: ['Software Engineering'],
          partial: ['software engineer', 'engineer', 'developer', 'coding'],
          roleKeywords: ['software engineer', 'engineer', 'developer']
        },
        'AI / Machine learning': {
          exact: ['AI/ML'],
          partial: ['ai', 'machine learning', 'artificial intelligence', 'ml'],
          roleKeywords: ['ai', 'machine learning', 'ml engineer']
        },
        'Cybersecurity': {
          exact: ['Cybersecurity'],
          partial: ['security', 'cyber', 'infosec'],
          roleKeywords: ['cybersecurity', 'security', 'cyber']
        }
      };
      
      const goalKeywords = goalMap[goal];
      if (!goalKeywords) return false;
      
      // Check for exact subCategory matches (highest priority)
      const hasExactSubCategory = goalKeywords.exact.some(keyword => 
        creator.subCategory.some(cat => cat === keyword)
      );
      
      if (hasExactSubCategory) return true;
      
      // Check role for exact keywords
      const hasRoleMatch = goalKeywords.roleKeywords.some(keyword => 
        creator.role.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (hasRoleMatch) return true;
      
      // Check partial matches in topics and subCategories
      return goalKeywords.partial.some(keyword => 
        creator.topics.some(topic => topic.toLowerCase().includes(keyword.toLowerCase())) ||
        creator.subCategory.some(cat => cat.toLowerCase().includes(keyword.toLowerCase())) ||
        creator.knownFor.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  };
  
  // Helper function to check content care preferences
  const matchesContentCare = (creator: Creator): boolean => {
    return userResponses.contentCare.some(care => {
      if (care === 'Someone who looks like me') {
        return matchesIdentity(creator);
      }
      if (care === 'Has first gen experience') {
        return creator.topics.some(topic => topic.toLowerCase().includes('first gen')) ||
               creator.knownFor.toLowerCase().includes('first gen') ||
               creator.subCategory.some(cat => cat.toLowerCase().includes('first gen'));
      }
      if (care === 'Someone whose company was acquired') {
        return creator.knownFor.toLowerCase().includes('acquired') ||
               creator.knownFor.toLowerCase().includes('exit') ||
               creator.role.toLowerCase().includes('acquired');
      }
      if (care === 'Someone with more experience (senior)') {
        return creator.careerStage.toLowerCase().includes('senior') ||
               creator.role.toLowerCase().includes('senior') ||
               creator.role.toLowerCase().includes('director') ||
               creator.role.toLowerCase().includes('vp');
      }
      return false;
    });
  };
  
  
  // Helper function to check if creator matches aspirational journey
  const matchesCareerJourney = (creator: Creator): boolean => {
    return userResponses.careerJourney.some(journey => {
      const journeyMap: Record<string, string[]> = {
        'Still in school': ['student', 'intern', 'university', 'college'],
        'Recent graduate': ['new grad', 'entry level', 'junior', 'recent graduate'],
        'Entry-level professional': ['entry level', 'junior', 'associate'],
        'Career changer': ['career change', 'transition', 'pivot', 'switching'],
        'Entrepreneur / Founder': ['founder', 'startup', 'entrepreneur', 'ceo'],
        'Looking for my first job': ['job search', 'recruiting', 'interview'],
        'Between jobs': ['job search', 'recruiting', 'career'],
        'Exploring new opportunities': ['opportunities', 'growth', 'development']
      };
      
      const keywords = journeyMap[journey] || [];
      return keywords.some(keyword => 
        creator.role.toLowerCase().includes(keyword) ||
        creator.knownFor.toLowerCase().includes(keyword) ||
        creator.subCategory.some(cat => cat.toLowerCase().includes(keyword))
      );
    });
  };
  
  
  // Helper function to calculate match score using actual data structure
  const calculateMatchScore = (creator: Creator): number => {
    let score = 0;
    
    // Goals alignment (highest priority) - using actual subCategory values
    userResponses.goals.forEach(goal => {
      const goalMap: Record<string, { exact: string[], role: string[], partial: string[], weight: number }> = {
        'Marketing in tech': {
          exact: ['Digital Marketing', 'Content strategy'], // Exact subCategory matches from data
          role: ['marketing', 'marketer', 'brand'],
          partial: ['marketing', 'brand', 'growth'],
          weight: 50
        },
        'Product management': {
          exact: ['Product Management'], // Exact subCategory match from data
          role: ['product manager', 'product', 'pm'],
          partial: ['product'],
          weight: 50
        },
        'Entrepreneurship': {
          exact: ['Founders, startup advice', 'fundraising and pitching'],
          role: ['founder', 'entrepreneur', 'ceo'],
          partial: ['startup', 'venture'],
          weight: 45
        },
        'Data science': {
          exact: ['Data Science', 'AI/ML'],
          role: ['data scientist', 'data', 'ai'],
          partial: ['analytics', 'machine learning'],
          weight: 50
        },
        'Software engineering': {
          exact: ['Software Engineering'],
          role: ['software engineer', 'engineer', 'developer'],
          partial: ['coding', 'programming'],
          weight: 50
        },
        'AI / Machine learning': {
          exact: ['AI/ML'],
          role: ['ai engineer', 'ml engineer', 'machine learning', 'ai researcher'],
          partial: ['ai', 'artificial intelligence', 'ml'],
          weight: 50
        },
        'Cybersecurity': {
          exact: ['Cybersecurity'],
          role: ['cybersecurity', 'security engineer', 'security analyst'],
          partial: ['security', 'cyber', 'infosec'],
          weight: 50
        }
      };
      
      const goalKeywords = goalMap[goal];
      if (!goalKeywords) return;
      
      // Exact subCategory match (highest score)
      const exactMatch = goalKeywords.exact.some(keyword => 
        creator.subCategory.some(cat => cat === keyword)
      );
      
      if (exactMatch) {
        score += goalKeywords.weight;
        return;
      }
      
      // Role-based match (high score)
      const roleMatch = goalKeywords.role.some(keyword => 
        creator.role.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (roleMatch) {
        score += Math.floor(goalKeywords.weight * 0.8); // 80% for role match
        return;
      }
      
      // Partial match in topics/subCategories (moderate score)
      const partialMatch = goalKeywords.partial.some(keyword => 
        creator.topics.some(topic => topic.toLowerCase().includes(keyword.toLowerCase())) ||
        creator.subCategory.some(cat => cat.toLowerCase().includes(keyword.toLowerCase())) ||
        creator.knownFor.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (partialMatch) {
        score += Math.floor(goalKeywords.weight * 0.4); // 40% for partial match
      }
    });
    
    // Identity match bonus
    if (matchesIdentity(creator)) score += 20;
    
    // Content care preferences
    if (matchesContentCare(creator)) score += 20;
    
    // Content preference alignment
    userResponses.contentPreference.forEach(content => {
      const contentMap: Record<string, string[]> = {
        'Personal brand': ['personal branding', 'brand', 'branding', 'personal brand', 'influence', 'creator economy'],
        'Getting an internship': ['internship', 'intern', 'recruiting', 'job search', 'interview'],
        'First gen': ['first gen', 'first generation', 'first-gen', 'underrepresented'],
        'Mental health': ['mental health', 'wellness', 'mindfulness', 'wellbeing'],
        'Tech skills & coding': ['coding', 'programming', 'tech', 'software', 'development', 'technical', 'engineering'],
        'Salary negotiation': ['salary', 'negotiation', 'compensation', 'pay', 'money', 'finance', 'benefits'],
        'Salary transparent': ['salary', 'compensation', 'pay', 'transparent', 'transparency'],
        'Straight to the point': ['tactical', 'concise', 'direct', 'straightforward'],
        'Humor & memes': ['humor', 'funny', 'memes', 'comedy', 'entertaining', 'relatable'],
        'Aesthetics & design': ['aesthetic', 'design', 'visual', 'creative', 'art', 'beautiful', 'style'],
        'Fashion tech': ['fashion', 'style', 'outfit', 'wardrobe', 'personal style', 'fashion tech', 'tech fashion']
      };
      
      const contentKeywords = contentMap[content] || [];
      
      // Special handling for personal brand and fashion tech
      if (content === 'Personal brand' || content === 'Fashion tech') {
        // Check for personal brand tag
        if (creator.tags && creator.tags.some(tag => 
            tag.toLowerCase().includes('personal brand') || 
            tag.toLowerCase().includes('fashion') ||
            tag.toLowerCase().includes('style'))) {
          score += 15; // Higher score for exact tag match
        }
      }
      
      if (contentKeywords.some(keyword => 
          creator.subCategory.some(cat => cat.toLowerCase().includes(keyword)) ||
          creator.knownFor.toLowerCase().includes(keyword) ||
          creator.topics.some(topic => topic.toLowerCase().includes(keyword)) ||
          creator.contentStyle.some(style => style.toLowerCase().includes(keyword)))) {
        score += 10;
      }
    });
    
    // Career journey alignment
    if (matchesCareerJourney(creator)) {
      score += 15;
    }
    
    // Small creator bonus (under 50K followers)
    if (creator.followers < 50000 && creator.followers > 0) score += 5;
    
    return score;
  };
  
  // Helper functions for diversity requirements
  const isSeniorExperience = (creator: Creator): boolean => {
    return creator.careerStage.toLowerCase().includes('senior') ||
           creator.role.toLowerCase().includes('senior') ||
           creator.role.toLowerCase().includes('director') ||
           creator.role.toLowerCase().includes('vp') ||
           creator.role.toLowerCase().includes('head of') ||
           creator.role.toLowerCase().includes('chief') ||
           creator.ageGroup === '30+';
  };
  
  const hasRecruitingExperience = (creator: Creator): boolean => {
    return creator.hasRecruitingExperience ||
           creator.knownFor.toLowerCase().includes('recruiting') ||
           creator.knownFor.toLowerCase().includes('interview') ||
           creator.knownFor.toLowerCase().includes('hiring') ||
           creator.topics.some(topic => topic.toLowerCase().includes('recruiting'));
  };
  
  // Filter creators by age preference if provided
  let filteredCreators = creators;
  if (userResponses.age) {
    filteredCreators = creators.filter(creator => {
      const userAge = userResponses.age;
      
      // For ages 18-25, include creators targeting younger audiences
      if (['18', '19', '20', '21', '22', '23', '24', '25'].includes(userAge)) {
        // Include creators who target younger audiences or are younger themselves
        return creator.ageGroup === '18-25' || 
               creator.ageGroup === '20s' || 
               creator.targetAudience.some(audience => 
                 audience.toLowerCase().includes('student') || 
                 audience.toLowerCase().includes('young') ||
                 audience.toLowerCase().includes('entry') ||
                 audience.toLowerCase().includes('college') ||
                 audience.toLowerCase().includes('university')
               );
      } else if (userAge === '26+') {
        // Include creators for more experienced professionals
        return creator.ageGroup === '30+' || 
               creator.ageGroup === '26+' || 
               creator.careerStage.toLowerCase().includes('senior') ||
               creator.careerStage.toLowerCase().includes('mid') ||
               creator.targetAudience.some(audience => 
                 audience.toLowerCase().includes('professional') || 
                 audience.toLowerCase().includes('senior') ||
                 audience.toLowerCase().includes('experienced') ||
                 audience.toLowerCase().includes('manager')
               );
      }
      return true;
    });
  }
  
  // Score all creators and return top matches with diversity requirements
  const scoredCreators = filteredCreators.map(creator => ({
    creator,
    score: calculateMatchScore(creator)
  }));
  
  // Sort by score (highest first)
  scoredCreators.sort((a, b) => b.score - a.score);
  
  // Get creators matching different criteria
  const goalMatchingCreators = scoredCreators.filter(({ creator }) => matchesGoals(creator));
  const seniorCreators = scoredCreators.filter(({ creator }) => isSeniorExperience(creator));
  const recruitingCreators = scoredCreators.filter(({ creator }) => hasRecruitingExperience(creator));
  const identityMatchingCreators = scoredCreators.filter(({ creator }) => matchesIdentity(creator));
  
  const selectedCreators = new Set<string>();
  const finalMatches: MatchedCreator[] = [];
  
  // 1. Add top goal-matching creator
  if (goalMatchingCreators.length > 0 && finalMatches.length < 5) {
    const { creator } = goalMatchingCreators.find(({ creator }) => !selectedCreators.has(creator.id)) || goalMatchingCreators[0];
    if (!selectedCreators.has(creator.id)) {
      selectedCreators.add(creator.id);
      finalMatches.push({
        ...creator,
        matchReason: 'Perfect match for your career goals',
        cta: `Follow on ${creator.platform}`,
        tags: [...creator.contentStyle, ...creator.topics.slice(0, 3)]
      });
    }
  }
  
  // 2. Ensure at least one senior experience creator
  if (finalMatches.length < 5) {
    const seniorMatch = seniorCreators.find(({ creator }) => !selectedCreators.has(creator.id));
    if (seniorMatch) {
      selectedCreators.add(seniorMatch.creator.id);
      finalMatches.push({
        ...seniorMatch.creator,
        matchReason: 'Senior experience and expertise',
        cta: `Follow on ${seniorMatch.creator.platform}`,
        tags: [...seniorMatch.creator.contentStyle, ...seniorMatch.creator.topics.slice(0, 3)]
      });
    }
  }
  
  // 3. Ensure at least one creator with recruiting experience
  if (finalMatches.length < 5) {
    const recruitingMatch = recruitingCreators.find(({ creator }) => !selectedCreators.has(creator.id));
    if (recruitingMatch) {
      selectedCreators.add(recruitingMatch.creator.id);
      finalMatches.push({
        ...recruitingMatch.creator,
        matchReason: 'Recruiting and hiring experience',
        cta: `Follow on ${recruitingMatch.creator.platform}`,
        tags: [...recruitingMatch.creator.contentStyle, ...recruitingMatch.creator.topics.slice(0, 3)]
      });
    }
  }
  
  // 4. Add identity match if "someone who looks like me" was selected
  if (userResponses.contentCare.includes('Someone who looks like me') && finalMatches.length < 5) {
    const identityMatch = identityMatchingCreators.find(({ creator }) => !selectedCreators.has(creator.id));
    if (identityMatch) {
      selectedCreators.add(identityMatch.creator.id);
      finalMatches.push({
        ...identityMatch.creator,
        matchReason: 'Matches your identity and representation',
        cta: `Follow on ${identityMatch.creator.platform}`,
        tags: [...identityMatch.creator.contentStyle, ...identityMatch.creator.topics.slice(0, 3)]
      });
    }
  }
  
  // 5. Fill remaining slots with highest scoring creators
  const remainingCreators = scoredCreators.filter(({ creator, score }) => 
    !selectedCreators.has(creator.id) && score > 0
  );
  
  for (let i = 0; i < remainingCreators.length && finalMatches.length < 5; i++) {
    const { creator } = remainingCreators[i];
    
    let matchReason = 'High compatibility score';
    if (matchesContentCare(creator)) {
      matchReason = 'Matches your content preferences';
    } else if (matchesCareerJourney(creator)) {
      matchReason = 'Aligns with your career journey';
    }
    
    selectedCreators.add(creator.id);
    finalMatches.push({
      ...creator,
      matchReason,
      cta: `Follow on ${creator.platform}`,
      tags: [...creator.contentStyle, ...creator.topics.slice(0, 3)]
    });
  }
  
  // Return final matches maintaining diversity requirements
  return finalMatches.slice(0, 5);
}