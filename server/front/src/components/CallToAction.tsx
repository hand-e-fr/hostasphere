import * as motion from "framer-motion/client"

const CallToAction: React.FC = () => {
    return (
        <section className="py-20 bg-blue-600">
            <motion.div
                initial={{opacity: 0, scale: 0.8}}
                whileInView={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                className="max-w-2xl mx-auto text-center"
            >
                <h2 className="text-3xl font-bold text-white">Achete</h2>
                <p className="mt-4 text-white">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, quidem.
                </p>
                <button
                    className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200">
                    Achete maintenant
                </button>
            </motion.div>
        </section>
    );
};

export default CallToAction;