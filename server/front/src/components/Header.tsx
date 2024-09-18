const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img src="../" alt="Hostasphere Logo" className="h-10"/>
                    <span className="text-xl font-bold text-gray-800">Hostasphere</span>
                </div>
            </div>
        </header>
    );
};

export default Header;