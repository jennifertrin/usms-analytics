import { AnalyzeResponse } from '@/types/api';

export const getSampleData = (): AnalyzeResponse => {
  return {
    "swimmer": {
      "name": "John Doe",
      "age": 35,
      "totalMeets": 12,
      "totalEvents": 48
    },
    "performance": {
      "bestTimes": [
        {"event": "50 Free", "time": "23.45", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
        {"event": "100 Free", "time": "52.12", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
        {"event": "200 Free", "time": "1:58.34", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
        {"event": "50 Free", "time": "24.67", "date": "2023-06-15", "meet": "Summer Nationals", "courseType": "LCM"},
        {"event": "100 Free", "time": "54.23", "date": "2023-06-15", "meet": "Summer Nationals", "courseType": "LCM"},
        {"event": "50 Back", "time": "28.67", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
        {"event": "100 Back", "time": "1:02.45", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
        {"event": "50 Breast", "time": "32.12", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
        {"event": "100 Breast", "time": "1:08.34", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
        {"event": "50 Fly", "time": "26.78", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
        {"event": "100 Fly", "time": "58.92", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
        {"event": "200 IM", "time": "2:15.67", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"}
      ],
      "recentTimes": [
        {"event": "50 Free", "times": [23.45, 23.67, 23.89, 24.12, 23.78]},
        {"event": "100 Free", "times": [52.12, 52.45, 52.89, 53.12, 52.67]}
      ]
    },
    "meetBreakdown": {
      "meets": [
        {
          "name": "Spring Championships 2024",
          "date": "2024-02-20",
          "location": "San Francisco, CA",
          "results": [
            {"event": "50 Free", "place": 3, "time": "23.45", "improvement": "-0.5s", "ageGroup": "35-39"},
            {"event": "100 Free", "place": 2, "time": "52.12", "improvement": "-1.2s", "ageGroup": "35-39"},
            {"event": "200 Free", "place": 1, "time": "1:58.34", "improvement": "-2.1s", "ageGroup": "35-39"},
            {"event": "50 Back", "place": 4, "time": "28.67", "improvement": "+0.3s", "ageGroup": "35-39"},
            {"event": "100 Back", "place": 3, "time": "1:02.45", "improvement": "-0.8s", "ageGroup": "35-39"},
            {"event": "50 Breast", "place": 5, "time": "32.12", "improvement": "+0.1s", "ageGroup": "35-39"}
          ]
        }
      ],
      "currentMeet": {
        "name": "Spring Championships 2024",
        "date": "2024-02-20",
        "location": "San Francisco, CA",
        "results": [
          {"event": "50 Free", "place": 3, "time": "23.45", "improvement": "-0.5s", "ageGroup": "35-39"},
          {"event": "100 Free", "place": 2, "time": "52.12", "improvement": "-1.2s", "ageGroup": "35-39"},
          {"event": "200 Free", "place": 1, "time": "1:58.34", "improvement": "-2.1s", "ageGroup": "35-39"},
          {"event": "50 Back", "place": 4, "time": "28.67", "improvement": "+0.3s", "ageGroup": "35-39"},
          {"event": "100 Back", "place": 3, "time": "1:02.45", "improvement": "-0.8s", "ageGroup": "35-39"},
          {"event": "50 Breast", "place": 5, "time": "32.12", "improvement": "+0.1s", "ageGroup": "35-39"}
        ]
      },
      "allTimeImprovements": [
        {"event": "50 Free", "improvement": "-2.3s", "date": "2023-01-15"},
        {"event": "100 Free", "improvement": "-3.1s", "date": "2023-02-20"},
        {"event": "200 Free", "improvement": "-4.2s", "date": "2023-03-10"},
        {"event": "50 Back", "improvement": "-1.8s", "date": "2023-01-15"},
        {"event": "100 Back", "improvement": "-2.5s", "date": "2023-02-20"},
        {"event": "50 Breast", "improvement": "-1.2s", "date": "2023-03-10"}
      ],
      "ageGroupImprovements": {
        "35-39": [
          {"event": "50 Free", "improvement": "-0.5s", "rank": 2},
          {"event": "100 Free", "improvement": "-1.2s", "rank": 1},
          {"event": "200 Free", "improvement": "-2.1s", "rank": 1}
        ],
        "40-44": [
          {"event": "50 Free", "improvement": "-0.3s", "rank": 3},
          {"event": "100 Free", "improvement": "-0.8s", "rank": 2},
          {"event": "200 Free", "improvement": "-1.5s", "rank": 2}
        ]
      }
    },
    "personalBests": {
      "allTime": [
        {"event": "50 Free", "time": "23.45", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
        {"event": "100 Free", "time": "52.12", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
        {"event": "200 Free", "time": "1:58.34", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
        {"event": "50 Free", "time": "24.67", "date": "2023-06-15", "meet": "Summer Nationals", "courseType": "LCM"},
        {"event": "100 Free", "time": "54.23", "date": "2023-06-15", "meet": "Summer Nationals", "courseType": "LCM"},
        {"event": "50 Back", "time": "28.67", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
        {"event": "100 Back", "time": "1:02.45", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
        {"event": "50 Breast", "time": "32.12", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
        {"event": "100 Breast", "time": "1:08.34", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
        {"event": "50 Fly", "time": "26.78", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
        {"event": "100 Fly", "time": "58.92", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
        {"event": "200 IM", "time": "2:15.67", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"}
      ],
      "byAgeGroup": {
        "18-24": [
          {"event": "50 Free", "time": "22.34", "date": "2019-06-15", "meet": "College Nationals", "courseType": "SCY"},
          {"event": "100 Free", "time": "49.87", "date": "2019-06-15", "meet": "College Nationals", "courseType": "SCY"},
          {"event": "200 Free", "time": "1:52.45", "date": "2019-06-15", "meet": "College Nationals", "courseType": "SCY"}
        ],
        "25-29": [
          {"event": "50 Free", "time": "23.12", "date": "2020-03-20", "meet": "Spring Classic", "courseType": "SCY"},
          {"event": "100 Free", "time": "51.23", "date": "2020-03-20", "meet": "Spring Classic", "courseType": "SCY"},
          {"event": "200 Free", "time": "1:56.78", "date": "2020-03-20", "meet": "Spring Classic", "courseType": "SCY"}
        ],
        "30-34": [
          {"event": "50 Free", "time": "23.89", "date": "2022-07-10", "meet": "Summer Nationals", "courseType": "LCM"},
          {"event": "100 Free", "time": "52.67", "date": "2022-07-10", "meet": "Summer Nationals", "courseType": "LCM"},
          {"event": "200 Free", "time": "1:59.12", "date": "2022-07-10", "meet": "Summer Nationals", "courseType": "LCM"}
        ],
        "35-39": [
          {"event": "50 Free", "time": "23.45", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
          {"event": "100 Free", "time": "52.12", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
          {"event": "200 Free", "time": "1:58.34", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"}
        ]
      }
    },
    "clubs": [
      {
        "name": "Aqua Masters",
        "location": "San Francisco, CA",
        "years": "2018-2023",
        "meets": 15,
        "events": 45,
        "bestTimes": 8,
        "logo": "🏊‍♂️"
      },
      {
        "name": "Golden State Swim Club",
        "location": "Los Angeles, CA",
        "years": "2015-2018",
        "meets": 8,
        "events": 24,
        "bestTimes": 5,
        "logo": "🏆"
      },
      {
        "name": "Pacific Masters",
        "location": "San Diego, CA",
        "years": "2012-2015",
        "meets": 6,
        "events": 18,
        "bestTimes": 3,
        "logo": "🌊"
      },
      {
        "name": "College Swim Team",
        "location": "Berkeley, CA",
        "years": "2008-2012",
        "meets": 20,
        "events": 60,
        "bestTimes": 12,
        "logo": "🎓"
      }
    ],
    "summary": {
      "totalEvents": 48,
      "totalPoints": 156,
      "averagePlace": 3.25
    },
    "insights": {
      "strengths": [
        "Strong performance in freestyle events",
        "Consistent improvement over time",
        "Good age group rankings"
      ],
      "improvements": [
        "Backstroke technique needs work",
        "Breaststroke timing could be improved",
        "Endurance in longer events"
      ],
      "recommendations": [
        "Focus on backstroke drills",
        "Increase breaststroke practice",
        "Add more distance training"
      ]
    },
    "eventDistribution": {
      "Freestyle": 12,
      "Backstroke": 8,
      "Breaststroke": 6,
      "Butterfly": 4,
      "Individual Medley": 3
    }
  };
}; 