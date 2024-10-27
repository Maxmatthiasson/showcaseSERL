"use client";

import { useEffect, useState } from 'react';
import styles from '../project.module.css';
import data from '../projects.json';
import Image from 'next/image';
import { Header } from '../../header';
import LoadingSpinner from '../../LoadingSpinner';

interface Project {
  id: number;
  title: string;
  description: string;
  tag: string[];
  type: string;
  url: string;
  screenshot: string;
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [projects, setProjects] = useState<Project[]>(data);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const newData = await import('../projects.json');
        if (Array.isArray(newData)) {
          setProjects(newData);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      import('../projects.json').then(newData => {
        if (Array.isArray(newData)) {
          setProjects(newData);
        }
      });
    }, 60000); //Reloads JSON file once a minute.

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filteredProject = projects.find((project: Project) => project.id.toString() === params.id);
    setProject(filteredProject || null);
  }, [projects, params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return <div className={styles.errorMessage}>No project found with the given ID</div>;
  }

  return (
    <div>
      <Header />

      <div className={styles.pageContainer}>
        <div className={styles.container}>
          <div className={styles.textContainer}>
            <h1 className={styles.projectTitle}>{project.title}</h1>

            <p className={styles.description}>{project.description}</p>

            <div className={styles.tagsContainer}>
              <strong>Tags:</strong>
              {project.tag.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}{index < project.tag.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>

            <p className={styles.type}><strong>Type:</strong> {project.type}</p>

            <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <strong className={styles.tag}>Link: </strong>
              <span className={styles.url}>{project.url}</span>
            </a>
          </div>

          <div className={styles.imageContainer}>
            <Image
              src={project.screenshot}
              alt={`Screenshot of ${project.title}`}
              width={400}
              height={200}
              className={styles.screenshot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
