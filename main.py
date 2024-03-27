# ИМПОРТ БИБЛИОТЕК
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify, get_flashed_messages
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, LoginManager, login_user, login_required, logout_user, current_user
from flask import session
import os
from flask import send_from_directory
from werkzeug.utils import secure_filename

# ПОДКЛЮЧЕНИЕ БАЗЫ ДАННЫХ
app = Flask(__name__)
app.app_context().push()
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'

db = SQLAlchemy(app)
app.secret_key = 'dev'
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


# ОПРЕДЕЛЕНИЕ МОДЕЛИ ПОЛЬЗОВАТЕЛЯ ДЛЯ БАЗЫ ДАННЫХ
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    login = db.Column(db.String(120), unique=True, nullable=False) 
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(120), nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True, default='../static/image/no-profile.png')

    # Метод для установки хеша пароля
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Метод для проверки пароля
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Метод для представления объекта User в виде строки
    def __repr__(self):
        return f"User('{self.username}', '{self.login}')"
    
# ОПРЕДЕЛЕНИЕ МОДЕЛИ КАРТОЧКИ ТОВАРА
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    size = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    # Дополнительные поля по необходимости

# ОПРЕДЕЛЕНИЕ МОДЕЛИ ДЛЯ КОРЗИНЫ ТОВАРОВ
class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product', backref=db.backref('favorites', lazy=True))

class Cart(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product', backref=db.backref('cart', lazy=True))

    def __repr__(self):
        return '<CartItem {}>'.format(self.id)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get_or_404(user_id)

# МАРШРУТИЗАЦИЯ СТРАНИЦ МАГАЗИНА
@app.route('/')
def main():
    product = Product.query.filter(Product.id < 7).all()
    sizeAll = []
    i = 0
    for item in product:
        sizeAll.append([])
        sizeAll[i] = item.size.split()
        i+=1
    return render_template('main.html', product=product, size=sizeAll)

@app.route('/header')
def header():
    return render_template('header.html')

@app.route('/footer')
def footer():
    return render_template('footer.html')

@app.route('/mens')
def mens():
    product = Product.query.filter(Product.id > 6).all()
    sizeAll = []
    i = 0
    for item in product:
        sizeAll.append([])
        sizeAll[i] = item.size.split()
        i+=1
    return render_template('mens.html', product=product, size=sizeAll, i=0)

@app.route('/womens')
def womens():
    product = Product.query.all()
    sizeAll = []
    i = 0
    for item in product:
        sizeAll.append([])
        sizeAll[i] = item.size.split()
        i+=1
    return render_template('womens.html', product=product, size=sizeAll)

@app.route('/sale')
def sale():
    product = Product.query.all()
    sizeAll = []
    i = 0
    for item in product:
        sizeAll.append([])
        sizeAll[i] = item.size.split()
        i+=1
    return render_template('sale.html', product=product, size=sizeAll)

@app.route('/about')
def about():
    return render_template("about.html")

# Маршрут для страницы регистрации
@app.route('/reg', methods=['GET', 'POST'])
def register():
    # Проверка метода запроса
    if request.method == 'POST':
        # Получение данных из формы
        username = request.form['username']
        login = request.form['login']
        password = request.form['password']
        # Создание нового пользователя
        user = User(username=username, login=login)
        # Установка хеш пароля
        user.set_password(password)
        # Добавление пользователя в базу данных
        db.session.add(user)
        # Сохранение изменений
        db.session.commit()
        # Перенаправление пользователя на страницу входа
        return redirect(url_for('login'))
    # Если метод GET, вывод страницы регистрации
    return render_template('reg.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']
        user = User.query.filter_by(login=login).first()
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('main'))
        else:
            # Сообщение шаблону, что пароль неверный
            return render_template('login.html', error='Неверный логин или пароль')
    else:
        return render_template('login.html')


@app.route('/logout', methods=['POST', 'GET'])
@login_required
def Logout():
    logout_user()
    return redirect('/login')


@app.route('/profile')
@login_required
def profile():
    return render_template("user.html", user=current_user)


@app.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        current_user.username = request.form['username']    
        current_user.login = request.form['login']
        current_user.phone = request.form['phone']
        current_user.address = request.form['address']
        db.session.commit()
        flash('Your profile has been updated!')
        return redirect(url_for('profile'))

    return render_template('settings.html', user=current_user)


# ЗАГРУЗКА ИЗОБРАЖЕНИЯ ПРОФИЛЯ
UPLOAD_FOLDER = os.path.join('static', 'image')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload_avatar', methods=['POST'])
@login_required
def upload_avatar():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        current_user.avatar_url = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        db.session.commit()
        return jsonify({'avatar_url': current_user.avatar_url})
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/uploads/<filename>')
@login_required
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ОФОРМЛЕНИЕ ЗАКАЗА
@app.route('/checkout', methods=['GET', 'POST'])
@login_required
def checkout():
    if request.method == 'POST':
        # Сохранение данных о заказе
        current_user.username = request.form['username']
        current_user.login = request.form['login']
        current_user.phone = request.form['phone']
        current_user.address = request.form['address']
        db.session.commit()
        
        # Сохранение флага в session для вывода alert при успешном оформлении заказа
        session['order_placed'] = True

        # Сохранение сообщения в Flash
        flash('Заказ оформлен!')
        
        return redirect(url_for('profile'))
    return render_template('checkout.html', user=current_user)


# КОРЗИНА 
@app.route('/toggle_favorite/<int:product_id>', methods=['POST'])
def toggle_favorite(product_id):
    if not current_user.is_authenticated:
        return jsonify({'error': 'Authentication required'}), 401  # Ошибка авторизации
    
    favorite = Favorite.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({'favorite': False})
    else:
        new_favorite = Favorite(user_id=current_user.id, product_id=product_id)
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify({'favorite': True})

@app.route('/favorites')
@login_required
def favorites():
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    products = [favorite.product for favorite in favorites]
    # Передача флага в шаблон, чтобы знать, пуста ли корзина
    is_favorite_empty = len(products) == 0
    return render_template('cart.html', products=products, is_favorite_empty=is_favorite_empty)

@app.route('/update_cart_item/<int:product_id>', methods=['POST'])
@login_required
def update_cart_item(product_id):
    size = request.form.get('size-{}'.format(product_id))
    quantity = request.form.get('quantity-{}'.format(product_id))
    return redirect(url_for('cart'))


if __name__ == '__main__':    
    db.create_all()        
    app.run(debug=True)