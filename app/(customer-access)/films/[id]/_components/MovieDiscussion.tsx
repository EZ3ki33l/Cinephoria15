"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  createPost,
  updatePost,
  deletePost,
  createRating,
  updateRating,
  likePost,
  unlikePost,
} from "./actions";
import { ThumbsUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import { revalidatePath } from "@/hooks/revalidePath";

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  parentId: string | null;
  likes: { userId: string }[];
  replies?: Post[];
  user: {
    firstName: string;
    userName: string | null;
    image: string | null;
  };
}

interface MovieDiscussionProps {
  movieId: number;
  initialPosts: Post[];
  initialRating: number | null;
  averageRating: number;
  totalRatings: number;
  userRatings: { userId: string; rating: number }[];
  isAdmin?: boolean;
}

export function MovieDiscussion({
  movieId,
  initialPosts,
  initialRating,
  averageRating,
  totalRatings,
  userRatings,
  isAdmin = false,
}: MovieDiscussionProps) {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [userRating, setUserRating] = useState(initialRating);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmitPost = async () => {
    if (!isSignedIn || !newPost.trim()) return;

    const result = await createPost({
      content: newPost,
      movieId,
      parentId: null,
    });

    if (result.success && result.data) {
      setPosts([result.data as Post, ...posts]);
      setNewPost("");
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!isSignedIn || !replyContent.trim()) return;

    const result = await createPost({
      content: replyContent,
      movieId,
      parentId,
    });

    if (result.success && result.data) {
      setPosts(posts.map(post => 
        post.id === parentId 
          ? { ...post, replies: [...(post.replies || []), result.data as Post] }
          : post
      ));
      setReplyTo(null);
      setReplyContent("");
    }
  };

  const handleUpdatePost = async (postId: string) => {
    if (!editContent.trim()) return;

    const result = await updatePost(postId, editContent);
    if (result.success) {
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, content: editContent, updatedAt: new Date() } : post
        )
      );
      setEditingPost(null);
      setEditContent("");
    }
  };

  const handleDeletePost = async (postId: string) => {
    const result = await deletePost(postId);
    if (result.success) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  const handleLike = async (postId: string) => {
    if (!isSignedIn) return;

    const findPost = (posts: Post[], targetId: string): Post | undefined => {
      for (const post of posts) {
        if (post.id === targetId) return post;
        if (post.replies) {
          const found = findPost(post.replies, targetId);
          if (found) return found;
        }
      }
      return undefined;
    };

    const updatePostLikes = (posts: Post[], targetId: string, hasLiked: boolean): Post[] => {
      return posts.map(post => {
        if (post.id === targetId) {
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter(like => like.userId !== user?.id)
              : [...post.likes, { userId: user?.id! }]
          };
        }
        if (post.replies) {
          return {
            ...post,
            replies: updatePostLikes(post.replies, targetId, hasLiked)
          };
        }
        return post;
      });
    };

    const post = findPost(posts, postId);
    if (!post) return;

    const hasLiked = post.likes.some(like => like.userId === user?.id);
    const result = await (hasLiked ? unlikePost(postId) : likePost(postId));
    
    if (result.success) {
      setPosts(updatePostLikes(posts, postId, hasLiked));
    } else {
      console.error(result.error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!isSignedIn) return;

    const result = await (userRating
      ? updateRating(movieId, rating)
      : createRating(movieId, rating));

    if (result.success) {
      setUserRating(rating);
    }
  };

  const getMostLikedPost = () => {
    if (posts.length === 0) return null;
    const sortedPosts = [...posts].sort((a, b) => b.likes.length - a.likes.length);
    return sortedPosts[0].likes.length > 0 ? sortedPosts[0].id : null;
  };

  const mostLikedPostId = getMostLikedPost();

  const renderPost = (post: Post, isReply = false, isMostLiked = false) => {
    const userRating = userRatings.find(r => r.userId === post.userId)?.rating;

    const renderStars = (rating: number) => {
      return (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      );
    };

    return (
      <motion.div
        key={post.id}
        className={`bg-white p-4 rounded-lg shadow space-y-2 ${
          !isReply && isMostLiked ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        initial={!isReply && isMostLiked ? { scale: 0.95 } : {}}
        animate={!isReply && isMostLiked ? { scale: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        {editingPost === post.id ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button onClick={() => handleUpdatePost(post.id)}>
                Enregistrer
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingPost(null)}
              >
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!isReply && isMostLiked && post.likes.length > 0 && (
              <div className="mb-3 text-primary font-medium flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                Commentaire le plus apprécié
              </div>
            )}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {post.user.image && (
                  <img
                    src={post.user.image}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">
                    {post.user.userName || post.user.firstName}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>
                    {userRating && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">•</span>
                        {renderStars(userRating)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {(user?.id === post.userId || isAdmin) && (
                <div className="flex gap-2">
                  {user?.id === post.userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingPost(post.id);
                        setEditContent(post.content);
                      }}
                    >
                      Modifier
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
            <div className="text-gray-700">{post.content}</div>
            {post.updatedAt > post.createdAt && (
              <div className="text-xs text-gray-400">
                Modifié {formatDistanceToNow(new Date(post.updatedAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </div>
            )}
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1 ${
                  post.likes.some((like) => like.userId === user?.id)
                    ? "text-primary"
                    : ""
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {post.likes.length}
              </Button>
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(post.id)}
                >
                  Répondre
                </Button>
              )}
            </div>

            {replyTo === post.id && (
              <div className="mt-2 pl-4 border-l-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Votre réponse..."
                  className="min-h-[80px]"
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => handleSubmitReply(post.id)}>
                    Répondre
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReplyTo(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {post.replies && post.replies.length > 0 && !isReply && (
              <div className="mt-4 space-y-4 pl-8 border-l-2 border-gray-100">
                {post.replies.map((reply) => renderPost(reply, true))}
              </div>
            )}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">
            {totalRatings > 0 ? (
              `${averageRating.toFixed(1)}/5`
            ) : (
              "Pas encore d'avis"
            )}
          </div>
          <div className="text-sm text-gray-500">
            {totalRatings > 0 ? (
              `${totalRatings} évaluation${totalRatings > 1 ? "s" : ""}`
            ) : (
              "Soyez le premier à noter ce film"
            )}
          </div>
        </div>
        <StarRating
          value={userRating || 0}
          onChange={handleRating}
          disabled={!isSignedIn}
        />
      </div>

      {!isSignedIn && (
        <div className="text-sm text-gray-500 bg-white p-4 rounded-lg shadow">
          Connectez-vous pour participer à la discussion ou noter le film
        </div>
      )}

      {isSignedIn && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="font-medium text-blue-800 mb-1">
              Quelques règles pour une discussion agréable :
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Évitez les spoilers pour préserver le plaisir des autres spectateurs</li>
              <li>Restez courtois et bienveillant dans vos échanges</li>
              <li>Privilégiez les critiques constructives</li>
            </ul>
          </div>
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Partagez votre avis sur le film..."
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmitPost}>Publier</Button>
        </div>
      )}

      <div className="space-y-4">
        {posts.length > 0 ? (
          <>
            {posts.map(post => (
              <div key={post.id}>
                {renderPost(post, false, post.id === mostLikedPostId)}
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-2">Aucun commentaire pour le moment</p>
            {isSignedIn && (
              <p className="text-primary">Soyez le premier à commenter ce film !</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 