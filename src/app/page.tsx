"use client";

import { Header } from './header';
import Link from "next/link";
import styles from './home.module.css';
import { useState, useEffect } from 'react';
import initialData from './project/projects.json';

// Function to get string up until the first period
function getFirstSentence(text: string): string {
  const endOfSentence = text.indexOf('.') !== -1 ? text.indexOf('.') : text.length;
  return text.substring(0, endOfSentence + 1);
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState(initialData);

  //Function to handle input change with proper typing
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  //Function to filter projects based on search criteria
  const filteredProjects = projects.filter(project => {
    const titleMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = project.tag.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const typeMatch = project.type.toLowerCase().includes(searchTerm.toLowerCase());

    return titleMatch || tagMatch || typeMatch;
  });

  //Function to fetch projects from the JSON file
  const fetchProjects = async () => {
    try {
      const response = await fetch('./project/projects.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    const intervalId = setInterval(fetchProjects, 60000); //Refresh interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section>
      <Header />

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search projects by title, tag, or type"
        value={searchTerm}
        onChange={handleSearchChange}
        className={styles.searchBar}
      />

      {/* Displays number of projects */}
      <div className={styles.projectCount}>
        Number of projects: {filteredProjects.length}
      </div>

      <div className={styles.cardContainer}>
        {filteredProjects.map(project => (
          <div key={project.id} className={styles.card}>
            <Link href={`/project/${project.id}`} className={styles.cardLink}>
              <h2 className={styles.cardTitle}>{project.title}</h2>
              <p className={styles.cardDescription}>{getFirstSentence(project.description)}</p>
              <div className={styles.cardTags}>
                {project.tag.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <p className={styles.cardType}>{project.type}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
