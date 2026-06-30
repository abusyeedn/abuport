import { useState, startTransition, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { FONTS } from "../theme"

interface FileItem {
    label: string
    url: string
    image: { src: string; alt?: string }
    logo?: { src: string; alt?: string }
}

interface FolderData {
    folderLabel: string
    folderColor: string
    file: FileItem
}

interface MacOSFolderProps {
    folders?: FolderData[]
    labelFont?: CSSProperties
    labelColor?: string
    style?: CSSProperties
}

const DEFAULT_FOLDERS: FolderData[] = [
    {
        folderLabel: "kynhood.proj",
        folderColor: "#5DADE2",
        file: {
            label: "Kynhood Project",
            image: {
                src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
                alt: "Kynhood",
            },
            url: "#kynhood2",
        },
    },
    {
        folderLabel: "Spaarks.intern",
        folderColor: "#5DADE2",
        file: {
            label: "Spaarks Internship",
            image: {
                src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
                alt: "Spaarks",
            },
            url: "https://framer.com",
        },
    },
    {
        folderLabel: "Case_Studies.fun",
        folderColor: "#5DADE2",
        file: {
            label: "Case Studies",
            image: {
                src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
                alt: "Case Studies",
            },
            url: "#casestudies",
        },
    },
    {
        folderLabel: "College.proj",
        folderColor: "#5DADE2",
        file: {
            label: "College Project",
            image: {
                src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
                alt: "College",
            },
            url: "https://framer.com",
        },
    },
    {
        folderLabel: "behance.link",
        folderColor: "#5DADE2",
        file: {
            label: "Behance",
            image: {
                src: "https://mir-s3-cdn-cf.behance.net/projects/404/147628166044787.Y3JvcCwxNDAwLDEwOTUsMCww.png",
                alt: "Behance",
            },
            url: "https://behance.net",
            logo: {
                src: "/gallery/behance.png",
                alt: "Behance",
            },
        },
    },
    {
        folderLabel: "videos.link",
        folderColor: "#5DADE2",
        file: {
            label: "Videos",
            image: {
                src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400",
                alt: "Videos",
            },
            url: "https://drive.google.com/drive/folders/1jSgVKQK0x52EAsJd-FqRHQ397Msoi2Z7",
            logo: {
                src: "/gallery/drive.png",
                alt: "Google Drive",
            },
        },
    },
    {
        folderLabel: "illustration.link",
        folderColor: "#5DADE2",
        file: {
            label: "Illustrations",
            image: {
                src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
                alt: "Illustrations",
            },
            url: "https://drive.google.com/drive/folders/1eQOgU3-smtpH70ZDf2w6Mu7oOLkD9gf7",
            logo: {
                src: "/gallery/drive.png",
                alt: "Google Drive",
            },
        },
    },
];

const DEFAULT_LABEL_FONT: CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: "20px",
    fontWeight: 600, // Semi-bold for better readability
    letterSpacing: "0.02em",
    lineHeight: "1em",
};

import { useNavigate } from 'react-router-dom'

export default function MacOSFolder(props: MacOSFolderProps) {
    const { 
        folders = DEFAULT_FOLDERS, 
        labelFont = DEFAULT_LABEL_FONT, 
        labelColor = "#000000" 
    } = props

    const navigate = useNavigate()

    const handleFileClick = (url: string) => {
        if (url.startsWith('#')) {
            // Navigate to route, e.g. #kynhood -> /kynhood
            navigate(url.replace('#', '/'))
        } else if (typeof window !== "undefined" && url) {
            window.open(url, "_blank")
        }
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                padding: "20px",
                overflow: "visible",
            }}
        >
            {folders.map((folder, index) => (
                <SingleFolder
                    key={index}
                    index={index}
                    folderColor={folder.folderColor}
                    folderLabel={folder.folderLabel}
                    file={folder.file}
                    labelFont={labelFont}
                    labelColor={labelColor}
                    onFileClick={handleFileClick}
                />
            ))}
        </div>
    )
}

interface SingleFolderProps {
    folderColor: string
    folderLabel: string
    file: FileItem
    labelFont: CSSProperties
    labelColor: string
    index: number
    onFileClick?: (url: string) => void
}

function SingleFolder(props: SingleFolderProps) {
    const { folderColor, folderLabel, file, labelFont, labelColor, index, onFileClick } =
        props

    const [isHovered, setIsHovered] = useState(false)

    const handleFileClick = (url: string) => {
        if (onFileClick) {
            onFileClick(url)
        } else if (typeof window !== "undefined" && url) {
            window.open(url, "_blank")
        }
    }

    return (
        <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.15,
            }}
            style={{
                width: "100%",
                height: "100%",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "visible",
            }}
            onMouseEnter={() => startTransition(() => setIsHovered(true))}
            onMouseLeave={() => startTransition(() => setIsHovered(false))}
        >
            {/* Paper card that comes out on hover */}
            <motion.div
                initial={{ scale: 0.6, y: 30, rotate: 0, opacity: 0 }}
                animate={{
                    scale: isHovered ? 1 : 0.6,
                    y: isHovered ? -110 : 30,
                    rotate: isHovered ? -5 : 0,
                    opacity: isHovered ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20, mass: 1 }}
                onClick={() => handleFileClick(file.url)}
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    transformOrigin: "center bottom",
                    width: "120px",
                    height: "140px",
                    backgroundColor: "#ffffff",
                    borderRadius: 4,
                    padding: "12px 10px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                    border: "1px solid rgba(0,0,0,0.12)",
                    cursor: "pointer",
                    pointerEvents: isHovered ? "auto" : "none",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    boxSizing: "border-box",
                    backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 0.8px, transparent 0)",
                    backgroundSize: "8px 8px",
                    overflow: "hidden",
                }}
            >
                <span style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#111827",
                    borderBottom: "1px solid #e5e7eb",
                    width: "100%",
                    paddingBottom: 4,
                    marginBottom: 6,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontFamily: FONTS.primary,
                    textTransform: "capitalize",
                }}>
                    {folderLabel.split(".")[0]}
                </span>
                <span style={{ fontSize: "6.5px", color: "#6b7280", fontFamily: FONTS.primary, lineHeight: 1.4 }}>
                    {file.label}
                </span>
            </motion.div>

            {/* Folder Icon with subtle shake */}
            <motion.div
                animate={
                    isHovered
                        ? {
                              rotate: [0, -1, 1, -1, 0],
                          }
                        : { rotate: 0 }
                }
                transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                }}
                style={{
                    position: "relative",
                    width: "70%",
                    height: "60%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 5,
                }}
            >
                {/* Folder Tab */}
                <div
                    style={{
                        position: "absolute",
                        top: "15%",
                        left: "10%",
                        width: "35%",
                        height: "12%",
                        backgroundColor: folderColor,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                />

                {/* Folder Body */}
                <div
                    style={{
                        position: "absolute",
                        top: "27%",
                        left: "5%",
                        width: "90%",
                        height: "60%",
                        backgroundColor: folderColor,
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Folder shine effect */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "40%",
                            background:
                                "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                    />
                    {/* Logo badge — bottom left */}
                    {file.logo && (
                        <img
                            src={file.logo.src}
                            alt={file.logo.alt || ""}
                            style={{
                                position: "absolute",
                                bottom: 6,
                                left: 8,
                                width: 22,
                                height: 22,
                                objectFit: "contain",
                                borderRadius: 4,
                            }}
                        />
                    )}
                </div>
            </motion.div>

            {/* Folder Label */}
            <div
                style={{
                    position: "absolute",
                    bottom: "8%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: labelColor,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    ...labelFont,
                }}
            >
                {folderLabel}
            </div>
        </motion.div>
    )
}
