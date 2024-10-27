"use client";

import { useEffect, useState } from 'react';
import data from '../project/projects.json';
import Image from 'next/image';
import Link from 'next/link';
import styles from './kiosk.module.css';
import QRCode from 'react-qr-code';

interface Project {
    id: number;
    title: string;
    description: string;
    tag: string[];
    type: string;
    url: string;
    screenshot: string;
}

export default function KioskPage() {
    const [projects] = useState<Project[]>(data);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
        }, 8000);

        return () => clearInterval(intervalId);
    }, [projects.length]);

    const project = projects[currentIndex];

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
                    <Link href={`/project/${project.id}`} passHref>
                        <QRCode 
                            value={`/project/${project.id}`}
                            size={100}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}