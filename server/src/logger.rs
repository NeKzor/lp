
use std::io::Write;

use chrono::Local;
use env_logger::Builder;
use log::LevelFilter;

pub fn init() {
    Builder::new()
        .format(|buf, record| {
            let mut local_style = buf.style();
            local_style.set_color(env_logger::fmt::Color::Rgb(171, 171, 171));

            let level_style = buf.default_level_style(record.level());

            writeln!(
                buf,
                "{} [{}] - {}",
                local_style.value(Local::now().format("%Y-%m-%d %H:%M:%S")),
                level_style.value(record.level()),
                record.args()
            )
        })
        .filter(None, LevelFilter::Info)
        .init();
}
