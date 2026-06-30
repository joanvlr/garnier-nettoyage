import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: params?.slug || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <h1 className="text-2xl font-bold text-[#062d3b] mb-4">Article non trouvé</h1>
        <Link href="/blog">
          <a className="text-cyan-600 hover:underline">Retour au blog</a>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 py-12 border-b">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog">
            <a className="text-cyan-600 hover:text-cyan-700 font-medium mb-6 inline-block">
              ← Retour au blog
            </a>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-slate-500 mb-4">
              Publié le {format(new Date(post.publishedAt), "d MMMM yyyy", { locale: fr })}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#062d3b] leading-tight mb-8">
              {post.title}
            </h1>
            {post.coverImage && (
              <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <motion.article 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-cyan max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-16 pt-8 border-t">
            <h3 className="text-xl font-bold text-[#062d3b] mb-4">Besoin d'un service de nettoyage ?</h3>
            <p className="text-slate-600 mb-6">
              Garnier Nettoyage accompagne les professionnels et les copropriétés à Montpellier pour un entretien irréprochable.
            </p>
            <Link href="/">
              <a className="inline-block bg-[#062d3b] text-white px-8 py-3 rounded-full font-bold hover:bg-cyan-900 transition-colors shadow-lg">
                Demander un devis gratuit
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
