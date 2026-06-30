import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function BlogList() {
  const { data: posts, isLoading } = trpc.blog.getAll.useQuery();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <Link href="/">
            <a className="text-cyan-600 hover:text-cyan-700 font-medium mb-4 inline-block">
              ← Retour à l'accueil
            </a>
          </Link>
          <h1 className="text-4xl font-bold text-[#062d3b] mb-4">Notre Blog</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Retrouvez tous nos conseils, actualités et guides sur le nettoyage professionnel et l'entretien de vos espaces à Montpellier.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-none shadow-sm">
                    {post.coverImage && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="text-sm text-slate-500 mb-2">
                        {format(new Date(post.publishedAt), "d MMMM yyyy", { locale: fr })}
                      </div>
                      <CardTitle className="text-xl text-[#062d3b] line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 line-clamp-3">
                        {post.excerpt || "Découvrez notre nouvel article..."}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-slate-500 text-lg">Aucun article publié pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
