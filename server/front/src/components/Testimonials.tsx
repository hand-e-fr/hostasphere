import * as motion from "framer-motion/client"

const testimonials = [
    {name: 'Emmanuel Macron', feedback: 'A coté langwatch c\'est bof.'},
    {name: 'Bernard Arnault', feedback: 'J\'ai jamais vu un truc aussi bien.'},
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800">Les Avis</h2>
                <div className="mt-10 space-y-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{opacity: 0, x: -50}}
                            whileInView={{opacity: 1, x: 0}}
                            transition={{duration: 0.5, delay: index * 0.2}}
                            className="p-6 bg-white rounded-lg shadow-md"
                        >
                            <p className="text-gray-600">"{testimonial.feedback}"</p>
                            <p className="mt-4 text-sm font-semibold text-gray-800">- {testimonial.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;