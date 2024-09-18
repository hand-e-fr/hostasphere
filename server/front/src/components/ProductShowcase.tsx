import * as motion from "framer-motion/client"

const ProductShowcase: React.FC = () => {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-100">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="max-w-2xl p-6 bg-white rounded-lg shadow-md"
            >
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Woaw omg hostasphere
                </h1>
                <p className="mt-4 text-gray-600 text-center">
                    Des graphiques et tout tah les ll
                </p>
                <div className="mt-6">
                    <img
                        src="https://via.placeholder.com/800x600"
                        alt="Product"
                        className="w-full h-auto rounded-md"
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default ProductShowcase;