import Link from 'next/link';

export default function Hero() {
  return (
    <section className="gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="container-custom text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          Welcome to Infinity Crochet
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto font-light">
          Handmade with love, crafted with care. Discover unique crochet creations 
          that bring warmth and beauty to your life.
        </p>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light">
          Thoughtfully crafted crochet pieces that offer warmth, comfort, and joy. 
          Adorable amigurumi, functional bags, and cozy home décor are all created 
          with care and a focus on quality details. Whether you're looking for the 
          perfect gift or something special for yourself, Infinity Crochet is here 
          to bring your crochet dreams to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/shop" className="btn-primary">
            Enter Shop
          </Link>
          <Link href="#about" className="btn-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
