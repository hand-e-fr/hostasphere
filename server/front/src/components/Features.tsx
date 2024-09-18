import * as motion from "framer-motion/client"

const features = [
    {title: 'Les couts', description: 'Pas de petites économies'},
    {title: 'Les graphiques', description: 'Les petites courbes qui montent'},
    {title: 'plein d\'autres plus mieux', description: 'Mieux que langwatch'},
];

const Features: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800">Features</h2>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{opacity: 0, y: 50}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: index * 0.2}}
                            className="p-6 bg-gray-100 rounded-lg shadow-md"
                        >
                            <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                            <p className="mt-2 text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;