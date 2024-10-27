"use client";

import { useEffect, useState } from 'react';
import data from '../../project/projects.json';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../kiosk.module.css';
import QRCode from 'react-qr-code';
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

export default function KioskProjectPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const projectId = parseInt(params.id, 10);
        const foundProject = data.find((p) => p.id === projectId);
        
        setLoading(true);
        setTimeout(() => {
            setProject(foundProject || null);
            setLoading(false);
        }, 1000); //Timeout to showcase the loading spinner.
    }, [params.id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!project) {
        return <div className={styles.errorMessage}>No project found with the given ID</div>;
    }

    function getFirstSentence(text: string): string {
        const endOfSentence = text.indexOf('.') !== -1 ? text.indexOf('.') : text.length;
        return text.substring(0, endOfSentence + 1);
    }

    return (
        <div className={styles.kioskContainer}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.kioskTitle}>{project.title}</h1>
                <div className={styles.imageContainer}>
                    <Image
                        src={project.screenshot}
                        alt={`Screenshot of ${project.title}`}
                        width={400}
                        height={200}
                        className={styles.screenshot}
                    />
                </div>

                <div className={styles.descriptionContainer}>
                    <p className={styles.description}>{getFirstSentence(project.description)}</p>
                </div>

                <div className={styles.tagsContainer}>
                    {project.tag.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                            {tag}{index < project.tag.length - 1 && ' '}
                        </span>
                    ))}
                </div>
                <p className={styles.type}>{project.type + ' project'}</p>

                <div className={styles.qrCodeContainer}>
                    <Link href={project.url} passHref>
                        <QRCode 
                            value={project.url} 
                            size={100}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
